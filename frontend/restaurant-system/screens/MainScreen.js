import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchOrdersFromAPI, updateOrderStatus } from '../service/api/ordersService'
import Header from '../components/Header';
import StatusBar from '../components/StatusBar';
import OrderCard from '../components/OrderCard';


const MainScreen = () => {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [canceledOrders, setCanceledOrders] = useState([]);
    const [doneOrders, setDoneOrders] = useState([]);

    const [doneOrdersTotal, setDoneOrdersTotal] = useState(0);

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
        // console.log(newOrders);

        const pending = newOrders.filter(order => order.status === 'pending');
        const active = newOrders.filter(order => order.status === 'received');
        const canceled = newOrders.filter(order => order.status === 'canceled');
        const done = newOrders.filter(order => order.status === 'done');

        
        setPendingOrders(pending);
        setActiveOrders(active);
        setCanceledOrders(canceled);
        setDoneOrders(done);
        setDoneOrdersTotal(done.length)
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
        } catch (error) {
            console.error('Failed to update order status on the backend:', error);
        }
    };

    const markAsCanceled = async (orderId) => {
        const order = pendingOrders.find(o => o.id === orderId);
        
        if (order) {
            setPendingOrders(prev => prev.filter(o => o.id !== orderId));
            setCanceledOrders(prev => [
                ...prev, 
                { 
                    ...order, 
                    status: 'canceled',
                }
            ]);
        }

        try {
            await updateOrderStatus('canceled', orderId);
        } catch (error) {
            console.error('Failed to update order status on the backend:', error);
        }
    };

    const markAsDone = async (orderId) => {
        const order = activeOrders.find(o => o.id === orderId);

        if (order){
            setActiveOrders(prev => prev.filter(o => o.id !== orderId));
            setDoneOrders(prev => [
                ...prev,
                {
                    ...order,
                    status: "done",
                }
            ]);

            setTimeout(() => {
                markAsDelivered(orderId)
            }, 2 * 60 * 1000)
        }

        try {
            await updateOrderStatus('done', orderId);
        } catch (error) {
            console.error('Failed to update order status on the backend:', error);
        }
    }

    const markAsDelivered = async (orderId) => {
        const order = activeOrders.find(o => o.id === orderId);

        if (order){
            setDoneOrders(prev => prev.filter(o => o.id !== orderId));
        }

        try {
            await updateOrderStatus('delivered', orderId);
        } catch (error) {
            console.error('Failed to update order status on the backend:', error);
        }
    }

    



    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.statusBarContainer}>
                <StatusBar color="#FFC107" label="Pending" count={pendingOrders.length} />
                <StatusBar color="#2196F3" label="Preparing" count={activeOrders.length} />
                <StatusBar color="#4CAF50" label="Done" count={doneOrders.length} />
                <StatusBar color="red" label="Canceled" count={canceledOrders.length} />
            </View>

            <View style={styles.ordersCardSection}>
                <OrderCard 
                    color="#FFC107" 
                    cardTitle="Pending" 
                    orders={pendingOrders}
                    markAsCanceled={markAsCanceled}
                    markAsDone={markAsDone}
                    markAsReceived={markAsReceived}
                />
                
                <OrderCard 
                    color="#2196F3" 
                    cardTitle="Preparing" 
                    orders={activeOrders}
                    markAsCanceled={markAsCanceled}
                    markAsDone={markAsDone}
                    markAsReceived={markAsReceived}
                />
                
                <OrderCard 
                    color="#4CAF50" 
                    cardTitle="Done" 
                    orders={doneOrders} 
                    markAsCanceled={markAsCanceled}
                    markAsDone={markAsDone}
                    markAsReceived={markAsReceived}
                />
            </View>
            
        </View>
    )
}

export default MainScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333',
    },
    statusBarContainer:{
        flexDirection: 'row',
        justifyContent: "space-evenly",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 30,
    },
    ordersCardSection: {
        width: "100%",
        flexDirection: 'row',
        padding: 12,
        justifyContent: "space-evenly",
    }
    
})