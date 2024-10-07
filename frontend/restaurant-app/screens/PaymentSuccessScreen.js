import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PaymentSuccessScreen = ({ route }) => {
    const { orderId, status } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Payment Successful!</Text>
            <Text style={styles.subtitle}>Order ID: {orderId}</Text>
            <Text style={styles.subtitle}>Status: {status}</Text>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default PaymentSuccessScreen;
