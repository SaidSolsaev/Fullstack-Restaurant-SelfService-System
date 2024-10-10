import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform, ActivityIndicator, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createOrderBackendCall } from '../services/api/getRestaurantInfo';
import { CartContext } from '../context/CartContext';
import * as Linking from "expo-linking";
import Constants from "expo-constants";


const PaymentProcessingScreen = ({ route }) => {
    const navigation = useNavigation();
    const {cartItems, isCartReady, getTotalPrice, clearCart} = useContext(CartContext);
    const totalPrice = getTotalPrice();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [vippsOrderId, setVippsOrderId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const paymentNotSuccessAlert = () => {
        if (Platform.OS === 'web'){
            const confirmQuit = window.confirm(
                "Payment Failed! Your payment was not successful. Please try again!",
            )

            if (confirmQuit){
                clearCart();
                navigation.navigate('Home')
            }
        } else {
            Alert.alert(
                'Payment Failed', 
                'Your payment was not successful. Please try again!',
                [
                    {
                        text: "Cancel Order",
                        onPress: () => {
                            clearCart();
                            navigation.navigate("Home");
                        },
                        style: "cancel"
                    },
                    {
                        text: "Try Again",
                        onPress: () => {
                            navigation.navigate('Payment', {phoneNumber});
                        },
                        style: "destructive"
                    }
                ],
                {cancelable: false}
            );
        }
    }

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

            const paymentResponse = await fetch(`${Constants.expoConfig?.extra?.NGROK_URL}/api/payment/callback`, {
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

            console.log(status)


            setTimeout(async () => {
                if (status === 'completed' || status === 'reserved') {
                    
                    const order = await createOrderBackendCall(cartItems, phoneNumber, totalPrice);
    
                    if (order) {
                        clearCart();
                        setIsLoading(false);
                        navigation.navigate('PaymentSuccess', { paymentSuccess: true, order });
                    } else {
                        Alert.alert('Error', 'Failed to create order.');
                    }
                } else {
                    setIsLoading(false);
                    paymentNotSuccessAlert();
                }
            }, 4000)
        
        } catch (error) {
            console.error('Error in payment callback:', error);
            Alert.alert('Error', 'Something went wrong.');
            setIsLoading(false);
        }
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
