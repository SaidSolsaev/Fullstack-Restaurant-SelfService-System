import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchOrdersFromAPI, updateOrderStatus } from '../service/api/ordersService'
import Header from '../components/Header';
import StatusBar from '../components/StatusBar';
import OrderCard from '../components/OrderCard';
import NewOrderModal from '../components/NewOrderModal';


const MainScreen = () => {
    const [receivedOrders, setReceivedOrders] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [canceledOrders, setCanceledOrders] = useState([]);
    const [doneOrders, setDoneOrders] = useState([]);

    const [doneOrdersTotal, setDoneOrdersTotal] = useState(0);

    const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
    const [currentReceivedOrder, setCurrentReceivedOrder] = useState(null);
    
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
        const received = newOrders.filter(order => order.status === 'received');
        const pending = newOrders.filter(order => order.status === 'pending');
        const active = newOrders.filter(order => order.status === 'preparing');
        const canceled = newOrders.filter(order => order.status === 'canceled');
        const done = newOrders.filter(order => order.status === 'done');

        if (received.length > receivedOrders.length){
            const newOrder = received[received.length - 1]
            openNewOrderModal(newOrder);
        }
        
        setReceivedOrders(received);
        setPendingOrders(pending);
        setActiveOrders(active);
        setCanceledOrders(canceled);
        setDoneOrders(done);
        setDoneOrdersTotal(done.length);
    }

    const openNewOrderModal = (order) => {
        setCurrentReceivedOrder(order);
        setIsOrderModalVisible(true);
    };

    const handleConfrimOrder = (selectedTime = 30) => {
        if (currentReceivedOrder){
            updateOrderStatus('pending', currentReceivedOrder.id, selectedTime);
            
            setPendingOrders(prev => 
                [
                    ...prev,
                    {
                        status: 'pending',
                        estimatedTime: selectedTime
                    }        
                ]
            )
            setReceivedOrders(prev => prev.filter(o => o.id !== currentReceivedOrder.id));

        }
        
        setIsOrderModalVisible(false);
        setCurrentReceivedOrder(null);
    }

    const handleCancelOrder = () => {
        if (currentReceivedOrder) {
            
            updateOrderStatus('canceled', currentReceivedOrder.id);

            setCanceledOrders(prev => 
                [
                    ...prev, 
                    { 
                        ...currentReceivedOrder, 
                        status: 'canceled' 
                    }
                ]
            );
            setReceivedOrders(prev => prev.filter(o => o.id !== currentReceivedOrder.id));
        }
        setIsOrderModalVisible(false);
        setCurrentReceivedOrder(null);
    };


    const markAsPreparing  = async (orderId) => {
        const order = pendingOrders.find(o => o.id === orderId);
        
        if (order) {
            setPendingOrders(prev => prev.filter(o => o.id !== orderId));
            setActiveOrders(prev => [
                ...prev, 
                { 
                    ...order, 
                    status: 'preparing',
                }
            ]);
        }

        try {
            await updateOrderStatus('preparing', orderId);
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
            }, 6000)
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
                    markAsPreparing={markAsPreparing}
                />
                
                <OrderCard 
                    color="#2196F3" 
                    cardTitle="Preparing" 
                    orders={activeOrders}
                    markAsCanceled={markAsCanceled}
                    markAsDone={markAsDone}
                    markAsPreparing={markAsPreparing}
                />
                
                <OrderCard 
                    color="#4CAF50" 
                    cardTitle="Done" 
                    orders={doneOrders} 
                    markAsCanceled={markAsCanceled}
                    markAsDone={markAsDone}
                    markAsPreparing={markAsPreparing}
                />
            </View>

            <NewOrderModal 
                isVisible={isOrderModalVisible}
                onConfirm={handleConfrimOrder}
                onCancel={handleCancelOrder}
                orderDetails={currentReceivedOrder}
            />
            
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