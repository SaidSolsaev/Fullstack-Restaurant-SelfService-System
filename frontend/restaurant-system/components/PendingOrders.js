import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native'
import React, {useState, useEffect} from 'react'
import moment from 'moment/moment';

const PendingOrders = ({pendingOrders, markAsReceived }) => {
    const [timeAgoTexts, setTimeAgoTexts] = useState({});

    useEffect(() => {
        updateTimeAgoTexts();

        const interval = setInterval(() => {
            updateTimeAgoTexts();
        }, 60000);

        return () => clearInterval(interval); 
    }, [pendingOrders]);

    

    const updateTimeAgoTexts = () => {
        const newTimeAgoTexts = {};
        
        pendingOrders.forEach(order => {
            const receivedTime = moment(order.createdAt);
            const timeAgo = moment().diff(receivedTime, 'minutes');
            newTimeAgoTexts[order.id] = `Received ${timeAgo} minute${timeAgo === 1 ? '' : 's'} ago`;
        });

        setTimeAgoTexts(newTimeAgoTexts);
    };

    const renderOrder = ({ item }) => (
        <View style={styles.orderItem}>
            <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
            <Pressable style={styles.receiveButton} onPress={() => markAsReceived(item.id)}>
                <Text style={styles.buttonText}>Mark as Received</Text>
            </Pressable>
            <Text style={styles.timeAgoText}>{timeAgoTexts[item.id]}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Pending Orders</Text>
            
            <FlatList
                data={pendingOrders}
                renderItem={renderOrder}
                keyExtractor={(item) => item.id.toString()}
                numColumns={1}
                contentContainerStyle={styles.gridList}
            />
        </View>
    )
}

export default PendingOrders

const styles = StyleSheet.create({
    container: {
        width: '30%',
        backgroundColor: '#fff',
        padding: 16,
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
    receiveButton: {
        backgroundColor: '#ff6347',
        padding: 8,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    gridList: {
        flexGrow: 1,
    },
    timeAgoText: {
        marginTop: 8,
        fontSize: 12,
        color: 'black',
    },
})