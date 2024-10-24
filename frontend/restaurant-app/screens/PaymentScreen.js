import React, {useContext,} from 'react';
import { View, Text, Pressable, StyleSheet, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import { initiateVippsPayment } from '../services/api/paymentApi';


const PaymentScreen = ({ route }) => {
    const { phoneNumber } = route.params;
    const { getTotalPrice } = useContext(CartContext);
    const navigation = useNavigation();
    let totalPrice = (10 * getTotalPrice()).toFixed(2);
    


    const handlePayment = (method) => {
        alert(`Du har valgt å betale med ${method}.`);
    };


    const handleVippsPayment = async () => {
        try {
            const orderId = `order-${Date.now()}`;
            const data = await initiateVippsPayment(phoneNumber, totalPrice, orderId);
            

            if (data.orderId){
                const vippsOrderId = data.orderId
                navigation.navigate('PaymentProcessing', { phoneNumber, vippsOrderId });
            }else{
                Alert.alert('Error', 'There is no reference.');
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

                    <Image 
                        style={{width: 100, height: 50, color: "white"}}
                        source={require("../assets/vipps_logo_rgb.png")}

                    />
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
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
});

export default PaymentScreen;
