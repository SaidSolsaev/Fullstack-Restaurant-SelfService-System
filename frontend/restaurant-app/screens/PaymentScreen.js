import React, {useContext, useEffect, useState} from 'react';
import { View, Text, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';
import * as Linking from "expo-linking";
import { useNavigation } from '@react-navigation/native';
import Constants from "expo-constants";


const PaymentScreen = ({ route }) => {
    const { phoneNumber } = route.params;
    const { getTotalPrice, cartItems } = useContext(CartContext);
    const navigation = useNavigation();
    let totalPrice = (10 * getTotalPrice()).toFixed(2);
    
    useEffect(() => {
        const handleDeepLink = (event) => {
            const url = event.url;
            
            if (url.includes('payment-processing')){
                const {queryParams} = Linking.parse(url);
                navigation.navigate('PaymentProcessing', {orderId: queryParams.orderId, phoneNumber: queryParams.phoneNumber})
            }
        };

        
        const subscription = Linking.addEventListener('url', handleDeepLink);


        Linking.getInitialURL().then((url) => {
            if (url && url.includes('payment-processing')){
                
                navigation.navigate('PaymentProcessing');
            }
        });

        return () => {
            subscription.remove();
        }

        
    }, [navigation])

    const handlePayment = (method) => {
        alert(`Du har valgt å betale med ${method}.`);
    };


    const handleVippsPayment = async () => {
        try {
            const orderId = `order-${Date.now()}`;

            const fallbackUrl = Platform.OS === 'web'
                ? `http://localhost:8081/payment-processing?phoneNumber=${phoneNumber}&orderId=${orderId}`
                : `exp://192.168.0.170:8081/--/payment-processing?phoneNumber=${phoneNumber}&orderId=${orderId}`;

            const response = await fetch(`${Constants.expoConfig?.extra?.NGROK_URL}/api/payment/start-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    phoneNumber: phoneNumber,
                    amount: totalPrice,
                    orderId: orderId,
                    fallbackUrl: fallbackUrl
                }),
            });

            if (!response.ok) {
                Alert.alert('Error', 'Failed to initiate payment.');
                console.error('Response not OK:', response.status);
                return;
            }
            
            const data = await response.json();

            if (data.url){
                Linking.openURL(data.url);
                
            }else{
                Alert.alert('Error', 'There is no Vipps URL.');
            }
            
        } catch (error) {
            console.error('Error initiating payment:', error);
            Alert.alert('Error', 'Failed to initiate payment');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choose payment method</Text>
            <Text style={styles.subtitle}>Phone Number: {phoneNumber}</Text>

            <View style={styles.buttonContainer}>
                <Pressable 
                    style={styles.paymentButton}
                    onPress={handleVippsPayment}
                >

                    <Ionicons name="logo-vimeo" size={40} color="#fff" />
                    <Text style={styles.buttonText}>Pay with Vipps</Text>
                
                </Pressable>

                <Pressable 
                    style={styles.paymentButton}
                    onPress={() => handlePayment('Card')}
                >
                    
                    <Ionicons name="card" size={40} color="#fff" />
                    <Text style={styles.buttonText}>Pay with Card</Text>
                
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFEBCD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    paymentButton: {
        backgroundColor: '#FF6347',
        height: 120,
        width: '45%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
});

export default PaymentScreen;
