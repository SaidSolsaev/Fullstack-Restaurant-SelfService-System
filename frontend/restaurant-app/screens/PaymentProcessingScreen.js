import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createOrderBackendCall } from '../services/api/getRestaurantInfo';
import { CartContext } from '../context/CartContext';
import * as Linking from "expo-linking";


const PaymentProcessingScreen = ({ route }) => {
    const navigation = useNavigation();
    const {cartItems, isCartReady, getTotalPrice, clearCart} = useContext(CartContext);
    const totalPrice = getTotalPrice();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [vippsOrderId, setVippsOrderId] = useState(null);
   

    useEffect(() => {

        const getUrlParams = async () => {
            const {orderId, phoneNumber} = route.params;

            setPhoneNumber(phoneNumber);
            setVippsOrderId(orderId);
        }

        const getUrlParamsWeb = async () => {
            const url = await Linking.getInitialURL();
            if (url){
                const {queryParams} = Linking.parse(url);
                setPhoneNumber(queryParams.phoneNumber);
                setVippsOrderId(queryParams.orderId);
            }
        }
     
        if (Platform.OS === 'web'){
            getUrlParamsWeb();
        }else{
            getUrlParams();
        }

        if (isCartReady && vippsOrderId) {
            handlePaymentCallback();
        }

    }, [isCartReady, vippsOrderId]);

    const handlePaymentCallback = async () => {
        try {

            const paymentResponse = await fetch(`https://7158-158-248-76-1.ngrok-free.app/api/payment/callback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: vippsOrderId,
                }),
            });

            
            if (!paymentResponse.ok) {
                throw new Error('Failed to retrieve payment status from backend.');
            }
            
            const { status } = await paymentResponse.json();
            console.log('handle payment callback Status: ', status);

            if (status === 'completed' || status === 'reserved') {
                
                const order = await createOrderBackendCall(cartItems, phoneNumber, totalPrice);

                if (order) {
                    clearCart();
                    navigation.navigate('PaymentSuccess', { paymentSuccess: true, order });
                } else {
                    Alert.alert('Error', 'Failed to create order.');
                }
            } else {
                Alert.alert('Payment Failed', 'Your payment was not successful.');
                navigation.navigate('PaymentFail', {paymentSuccess: false, phoneNumber});
            }
        
        } catch (error) {
            console.error('Error in payment callback:', error);
            Alert.alert('Error', 'Something went wrong.');
        }
    };

    return (
        <View style={styles.container}>
            <Text>Processing Payment...</Text>
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
});

export default PaymentProcessingScreen;
