import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchOrdersFromAPI, updateOrderStatus } from '../service/api/ordersService'
import PendingOrders from '../components/PendingOrders';


const MainScreen = () => {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);


    useEffect(() => {
        fetchOrders();

        const interval = setInterval(() => {
            fetchOrders();
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);


    const fetchOrders = async () => {
        const newOrders = await fetchOrdersFromAPI();

        const pending = newOrders.filter(order => order.status === 'pending');
        const active = newOrders.filter(order => order.status === 'received');

        setPendingOrders(pending);
        setActiveOrders(active);
    }




    const markAsReceived = async (orderId) => {
        const order = pendingOrders.find(o => o.id === orderId);
        
        if (order) {
            setPendingOrders(prev => prev.filter(o => o.id !== orderId));
            setActiveOrders(prev => [
                ...prev, 
                { 
                    ...order, 
                    status: 'received',
                }
            ]);
        }

        try {
            await updateOrderStatus('received', orderId);
            console.log("Marked as received", orderId);
        } catch (error) {
            console.error('Failed to update order status on the backend:', error);
        }
    };

    const markAsDone = async (orderId) => {
        const order = activeOrders.find(o => o.id === orderId);

        if (order){
            setActiveOrders(prev => prev.filter(o => o.id !== orderId));
        }

        try {
            await updateOrderStatus('done', orderId);
            console.log("Marked as done", orderId);
        } catch (error) {
            console.error('Failed to update order status on the backend:', error);
        }
    }

    

    const renderActiveOrder = ({ item }) => {
        const detailedItems = item.menuItems.map(menuItem => {
            const addOns = menuItem.OrderItems.addOns?.map(addOn => addOn.name).join(", ");
            return `${menuItem.OrderItems.quantity}x ${menuItem.name} (${addOns ? addOns : 'No add-ons'})`;
        }).join("\n");

        return (
            <View style={styles.orderItem}>
                <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
                <Text>Total: ${item.totalAmount}</Text>
                <Text>{detailedItems}</Text>
                
                <Pressable style={styles.receiveButton} onPress={() => markAsDone(item.id)}>
                    <Text style={styles.buttonText}>Mark as Done</Text>
                </Pressable>
            </View>
        )

    };


    return (
        <View style={styles.container}>
            
            <View style={styles.activeSection}>
                <Text style={styles.sectionTitle}>Active Orders</Text>
                <FlatList
                    data={activeOrders}
                    renderItem={renderActiveOrder}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={1}
                    contentContainerStyle={styles.gridList}
                />
                
            </View>

            <PendingOrders pendingOrders={pendingOrders} markAsReceived={markAsReceived}/>
        </View>
    )
}

export default MainScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 26,
        backgroundColor: '#f0f0f0',
    },
    activeSection: {
        width: '70%', // Active orders take up 40% of the screen
        backgroundColor: '#fff',
        padding: 16,
        marginRight: 16,
        borderRadius: 10,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    orderItem: {
        flex: 1,
        padding: 16,
        margin: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    gridList: {
        flexGrow: 1,
    },
})