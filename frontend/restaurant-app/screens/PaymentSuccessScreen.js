import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const PaymentSuccessScreen = ({route}) => {
    const navigation = useNavigation();
    const { order } = route.params;
    console.log(order);

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('Home');
        }, 15000);

        return () => clearTimeout(timer);
    }, [navigation]);


    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.successText}>Payment Successful!</Text>
                <Text style={styles.orderIdText}>Order ID: {order.orderNumber}</Text>
                <Text style={styles.orderInfoText}>Total: ${order.totalAmount}</Text>
                {/* Add more order information as needed */}
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
});

export default PaymentSuccessScreen;
