import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { createOrderBackendCall } from '../services/api/getRestaurantInfo';
import { CartContext } from '../context/CartContext';


const PaymentSuccessScreen = ({route}) => {
    const navigation = useNavigation();
    const { cartItems, phoneNumber, totalPrice } = route.params;
    const [orderCreated, setOrderCreated] = useState(false);
    const {clearCart} = useContext(CartContext);
    
    useEffect(() => {
        const createOrder = async () => {
            if (!orderCreated){
                try {
                    const order = await createOrderBackendCall(cartItems, phoneNumber, totalPrice);
                    console.log(order)
                    
                    if (order){
                        clearCart();
                        setOrderCreated(true);
                    } else{
                        throw new Error('Order creation failed');
                    }
                } catch (error) {
                    Alert.alert('Error', 'Failed to create order. Please try again.');
                }
            }
        };

        createOrder();

        const timer = setTimeout(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        }, 15000);

        return () => clearTimeout(timer);
    }, [navigation, cartItems, phoneNumber, totalPrice, orderCreated])



    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.successText}>Payment Successful!</Text>
                {orderCreated ? (
                    <>
                        <Text style={styles.orderIdText}>Order created successfully!</Text>
                        <Text style={styles.orderInfoText}>Thank you for your purchase.</Text>
                    </>
                ) : (
                    <Text style={styles.orderInfoText}>Creating your order...</Text>
                )}
            </View>

            <Pressable onPress={() => navigation.navigate('Home')} style={styles.button}>
                <Text style={styles.buttonText}>Go to Home</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        width: '80%',
        alignItems: 'center',
    },
    successText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#28a745',
        marginBottom: 20,
    },
    orderIdText: {
        fontSize: 18,
        color: '#333',
        marginBottom: 10,
    },
    orderInfoText: {
        fontSize: 16,
        color: '#555',
    },
    button: {
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
});

export default PaymentSuccessScreen;
