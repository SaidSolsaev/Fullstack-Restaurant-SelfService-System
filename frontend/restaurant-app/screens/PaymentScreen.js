import React, {useContext, useEffect} from 'react';
import { View, Text, Pressable, StyleSheet, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';



const PaymentScreen = ({ route, navigation }) => {
    const { phoneNumber } = route.params;
    const { getTotalPrice } = useContext(CartContext);


    const handlePayment = (method) => {
        alert(`Du har valgt å betale med ${method}.`);
    };

    let totalPrice = (10 * getTotalPrice()).toFixed(2);

    const handleVippsPayment = async () => {
        try {
            const response = await fetch('https://c895-158-248-76-1.ngrok-free.app/api/payment/start-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    phoneNumber: phoneNumber,
                    amount: totalPrice,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.url) {
                    Linking.openURL(data.url);
                } else {
                    Alert.alert('Error', 'Failed to initiate payment');
                }
            } else {
                Alert.alert('Error', 'Failed to initiate payment');
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
