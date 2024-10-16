import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Platform, ActivityIndicator, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CartContext } from '../context/CartContext';
import { pollPaymentStatus } from '../services/api/paymentApi';


const PaymentProcessingScreen = ({ route }) => {
    const navigation = useNavigation();
    const {cartItems, getTotalPrice, clearCart} = useContext(CartContext);
    const totalPrice = getTotalPrice();
    const { phoneNumber, vippsOrderId, paymentMethod } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [orderProcessed, setOrderProcessed] = useState(false);
    const intervalIdRef = useRef(null);

    
    useEffect(() => {
        const pollPayment = async () => {
            try {
                const status = await pollPaymentStatus(vippsOrderId);
      
                if (status.status === 'completed' && !orderProcessed) {
                    setOrderProcessed(true);
                    clearInterval(intervalIdRef.current);
                    navigateToSuccess();
                } else if (['failed', 'cancelled'].includes(status.status)) {
                    setOrderProcessed(true);
                    clearInterval(intervalIdRef.current);
                    navigation.navigate('PaymentFail', { cartItems, phoneNumber})
                }
            } catch (error) {
                console.error('Error polling payment status:', error);
                clearInterval(intervalIdRef.current);
                Alert.alert('Error', 'Failed to retrieve payment status.');
            }
        };
      
          
        if (!orderProcessed) {
            intervalIdRef.current = setInterval(pollPayment, 5000);
        }
      
        return () => clearInterval(intervalIdRef.current);
    
    }, [vippsOrderId, orderProcessed]);

    
    const navigateToSuccess = () => {
        clearCart();
        setIsLoading(false);
        navigation.navigate('PaymentSuccess', { cartItems, phoneNumber, totalPrice });
    };


    return (
        <View style={styles.container}>
            {isLoading ? (
                <>
                    <ActivityIndicator size="large" color="#FF6347" />
                    <Text style={styles.loadingText}>Confirming your payment...</Text>
                </>
            ) : (
                <Text>Payment processing complete</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFEBCD',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        color: '#333',
    },
});

export default PaymentProcessingScreen;
