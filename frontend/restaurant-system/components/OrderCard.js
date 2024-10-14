import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react';
import moment from 'moment'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';

const {width} = Dimensions.get('screen')


const OrderCard = ({cardTitle, orders, color, markAsPreparing, markAsCanceled, markAsDone}) => {
    const [remainingTime, setRemainingTime] = useState({});;

    const calculateRemainingTime = (order) => {
        const currentTime = moment();
        const orderTime = moment(order.createdAt);
        const estimatedMinutes = parseInt(order.estimatedTime.split(' ')[0]);
        
        const timePassed = currentTime.diff(orderTime, 'minutes');
        const remainingTime = estimatedMinutes - timePassed;

        return remainingTime;
    };
    
    useEffect(() => {
        const updateRemainingTimes = () => {
            const newRemainingTimes = {};

            orders.forEach(order => {
                if (order.status === 'preparing'){
                    newRemainingTimes[order.id] = calculateRemainingTime(order);
                }
            });

            setRemainingTime(newRemainingTimes);
        }

        const interval = setInterval(updateRemainingTimes, 60000);

        updateRemainingTimes();

        return () => clearInterval(interval);
    }, [orders]);


    const formatTime = (timeString) => {
        return moment(timeString).format('HH:mm');
    }

    


    if(!orders && orders.length === 0){
        return <Text>Loading..</Text>
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.titleRow, { backgroundColor: color }]}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{cardTitle}</Text>
                    <Text>
                        {cardTitle === 'Pending' && (
                            <FontAwesome name="hourglass-1" size={24} color="black" />
                        )}
                        {cardTitle === 'Preparing' && (
                            <Ionicons name="fast-food" size={24} color="black" />
                        )}
                        {cardTitle === 'Done' && (
                            <Ionicons name="cloud-done" size={24} color="black" />
                        )}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.orderCardText}>Time</Text>
                    <Text style={styles.orderCardText}>Order</Text>
                    <Text style={styles.orderCardText}>Total</Text>

                    {cardTitle === 'Preparing' && (
                        <Text style={styles.orderCardText}>Timeleft</Text>
                    )}
                </View>
            </View>

            <ScrollView>
                {orders.map((order) => {
                    const rt = remainingTime[order.id] !== undefined ? remainingTime[order.id] : null;
                    const isLate = rt !== null && rt < 0;

                    const displayTime = rt !== null
                        ? (isLate ? `-${Math.abs(rt)} min` : `${rt} min`)
                    : 'Calculating...';
                    
                    if (!order.id){
                        return null;
                    }
                  
                    return (
                        <View key={order.id} style={styles.orderCard}>
                            <View style={styles.row}>
                                <Text style={styles.orderCardText}>{formatTime(order.createdAt)}</Text>
                                <Text style={styles.orderCardText}>#{order.orderNumber}</Text>
                                <Text style={styles.orderCardText}>${order.totalAmount}</Text>

                                {cardTitle === 'Preparing' && (
                                    <Text style={[styles.orderCardText, isLate && { color: 'red' }]}>
                                        {displayTime}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.orderBtns}>
                                {cardTitle === 'Pending' && (
                                    <>
                                        <Pressable key={`${order.id}-start`} style={styles.addBtn} onPress={() => markAsPreparing(order.id)}>
                                            <Text>Start</Text>
                                        </Pressable>

                                        <Pressable key={`${order.id}-cancel`} style={styles.cancelBtn} onPress={() => markAsCanceled(order.id)}>
                                            <Text>Cancel</Text>
                                        </Pressable>
                                    </>
                                )}

                                {cardTitle === 'Preparing' && (
                                    <Pressable key={`${order.id}-done`} style={styles.addBtn} onPress={() => markAsDone(order.id)}>
                                        <Text>Mark as Done</Text>
                                    </Pressable>
                                )}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    )
}

export default OrderCard

const styles = StyleSheet.create({
    container: {
        width: width * 0.33,
        padding: 12,
        flex: 1,
        maxHeight: 600
    },
    header: {
        flexDirection: 'column',

    },
    titleRow:{
        flexDirection: 'row',
        justifyContent: "space-between",
        padding: 12,
    },

    row: {
        flexDirection: 'row',
        justifyContent: "space-between",
        padding: 12,
        backgroundColor: "#fff"
    },
    orderCard:{
        backgroundColor: "#fff",
        marginVertical: 10,
    },
    orderCardText: {
        fontWeight: "bold",
        fontSize: 12
    },
    orderBtns: {
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    addBtn:{
        backgroundColor: "green",
        padding: 4
    },
    cancelBtn: {
        padding: 4,
        backgroundColor: "red",
    }
})