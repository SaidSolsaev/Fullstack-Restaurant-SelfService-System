import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Platform, ActivityIndicator, Pressable, Image, } from 'react-native';
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
            <View style={styles.leftSide}>
                <View style={styles.textContainer}>
                    
                    <View style={styles.amountBox}>
                        <Text style={{fontSize: 18, fontWeight: "600", marginRight: 15}}>Total</Text>
                        <Text style={styles.price}>${totalPrice}</Text>
                    </View>
                    
                    
                    <Text>
                        Follow the instructions on your phone.
                    </Text>

                    {isLoading && 
                        <ActivityIndicator size="small" color="#FF6347" />
                    }

                    <Pressable style={styles.button}>
                        <Text>Go back</Text>
                    </Pressable>

                </View>

                <View style={styles.bottomContainer}>
                    <Text>Payment Method</Text>
                </View>
                
            </View>

            <View style={styles.rightSide}>
                <Image style={styles.image} source={require("../assets/phone_push_warning.png")}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFEBCD',
        flexDirection: "row",
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        color: '#333',
    },
    leftSide: {
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "column",
        padding: 45,
        width: "50%"
    },
    textContainer: {
        alignItems: "center",
    },
    amountBox: {
        flexDirection: "row",
        margin: 20,
        alignItems: "center",
        textAlign: "center"
    },
    price: {

    },
    rightSide: {
        padding: 45,
        alignItems: "center",
        justifyContent: "center",
        width: "50%"
    },
    image: {
        width: 300,
        height: 300
    },
    bottomContainer: {
    }
});

export default PaymentProcessingScreen;
