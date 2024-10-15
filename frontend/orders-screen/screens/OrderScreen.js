import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchOrdersFromAPI, saveOrdersToStorage, loadOrdersFromStorage } from '../service/api/ordersService'
import moment from 'moment/moment'

const OrderScreen = () => {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [doneOrders, setDoneOrders] = useState([]);

    useEffect(() => {
        loadOrdersFromStorage()
            .then((storedOrders) => {
                if (storedOrders){
                    separateOrders(storedOrders);
                }
                fetchAndSaveOrders();
            })
        .catch((error) =>console.error('Error loading orders:', error));
    }, []);

    const separateOrders = (orders) => {
        const today = moment().startOf('day');

        const todaysOrders = orders.filter(order => {
            const orderDate = moment(order.createdAt);
            return orderDate.isSameOrAfter(today);
        });

        const pending = todaysOrders.filter(order => order.status === 'pending' || order.status === 'preparing');
        const done = todaysOrders.filter(order => order.status === 'done');
        setPendingOrders(pending);
        setDoneOrders(done);

        done.forEach(order => startDoneOrderTimer(order.orderNumber));
    };

    const fetchAndSaveOrders = async () => {
        const newOrders = await fetchOrdersFromAPI();
        
        if (newOrders) {
            separateOrders(newOrders);
            await saveOrdersToStorage(newOrders);
        }
    };

    const startDoneOrderTimer = (orderNumber) => {
        setTimeout(() => {
            setDoneOrders(prevDoneOrders => prevDoneOrders.filter(order => 
                order.orderNumber !== orderNumber
            ));
        }, 3 * 60 * 1000)
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchAndSaveOrders();
        }, 5000)

        return () => clearInterval(interval);
    }, []);

    const renderOrder = ({item, orderType}) => (
        <View style={[
            styles.orderItem, 
            orderType === 'pending' ? styles.pendingOrder : styles.doneOrder
        ]}>
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.ordersContainer}>
                
                <View style={[styles.section, styles.pendingSection]}>
                    <Text style={styles.sectionTitle}>Pending Orders</Text>
                    
                    <FlatList
                        data={pendingOrders}
                        renderItem={({item}) => renderOrder({item, orderType: 'pending'})}
                        keyExtractor={(item) => item.orderNumber.toString()}
                        numColumns={3}
                        contentContainerStyle={styles.list}
                    />
                </View>

                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Done Orders</Text>
                    
                    <FlatList
                        data={doneOrders}
                        renderItem={({item}) => renderOrder({item, orderType: 'done'})}
                        keyExtractor={(item) => item.orderNumber.toString()}
                        numColumns={3}
                        contentContainerStyle={styles.list}
                    />
                </View>
            </View>
            
        </View>
    )
}

export default OrderScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        marginTop: 40
    },
    ordersContainer: {
        flexDirection: 'row',
    },
    section: {
        flex: 1,
        paddingHorizontal: 10,
    },
    pendingSection: {
        borderRightWidth: 2,
        borderRightColor: '#ccc',
        
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        borderBottomColor: "#ccc",
        borderBottomWidth: 2
    },
    list: {
        flexGrow: 1,
    },
    orderItem: {
        padding: 20,
        margin: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        elevation: 2,
        flex: 1,
        maxWidth: '30%',
        flexBasis: '30%',
        minWidth: '30%',
    },
    pendingOrder: {
        backgroundColor: 'orange',
    },
    doneOrder: {
        backgroundColor: 'green',
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})