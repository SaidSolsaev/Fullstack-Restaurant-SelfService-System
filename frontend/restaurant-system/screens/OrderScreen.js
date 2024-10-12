import { StyleSheet, Text, View, Pressable, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchOrdersFromAPI } from '../service/api/ordersService';
import { Audio } from 'expo-av';
import * as Print from 'expo-print';
import moment from 'moment/moment';

const OrderScreen = () => {
    const [orders, setOrders] = useState([]);
    const [sound, setSound] = useState(null);
    const [pendingOrderIds, setPendingOrderIds] = useState([]);


    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (pendingOrderIds.length > 0) {
                playSound();
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [pendingOrderIds]);

    const fetchOrders = async () => {
        const newOrders = await fetchOrdersFromAPI();
        
        setOrders(newOrders);

        const pending = newOrders.filter(order => order.status === 'pending');
        setPendingOrderIds(pending.map(order => order.id));
    };

    const playSound = async () => {
        const {sound} = await Audio.Sound.createAsync(
            require('../assets/new-order-alert.mp3')
        );
        setSound(sound);
        await sound.playAsync();
    };

    const stopSound = () => {
        if (sound) {
            sound.stopAsync();
        };
    };

    const markAsReceived = (orderId) => {
        setPendingOrderIds(prev => prev.filter(id => id !== orderId));
        stopSound();

        const order = orders.find(o => o.id === orderId);
        console.log(order);
        if (order) {
            Alert.alert(
                'Order Details',
                `Order #${order.orderNumber}\nTotal: $${order.totalAmount}\nItems:\n` +
                order.menuItems.map(item => `${item.OrderItems.quantity}x ${item.name} (${item.OrderItems.addOns?.map(addOn => addOn.name).join(", ")})`).join("\n")
            );
        }

        //Call API to mark as recived here -->
    }

    const markAsDone = async (orderId) => {

    }

    const printReceipt = (order) => {
        const html = `
            <h1>Order #${order.orderNumber}</h1>
            <p>Total: $${order.totalAmount}</p>
            <h2>Items</h2>
            <ul>
                ${order.items.map(item => `
                    <li>${item.quantity}x ${item.name} (${item.addOns?.map(addOn => addOn.name).join(", ")})</li>
                `).join("")}
            </ul>
        `;
        Print.printAsync({ html });
    }

    const renderOrder = ({ item }) => (
        <View style={styles.orderItem}>
            <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
            <Pressable onPress={() => markAsReceived(item.id)}>
                <Text>Mark as Received</Text>
            </Pressable>
        </View>
    )

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                renderItem={renderOrder}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
            />
        </View>
    )
}

export default OrderScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    list: {
        flexGrow: 1,
    },
    orderItem: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        elevation: 2,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})