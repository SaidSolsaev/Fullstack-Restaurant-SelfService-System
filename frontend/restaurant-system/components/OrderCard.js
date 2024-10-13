import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react';
import moment from 'moment'

const {width} = Dimensions.get('window')


const OrderCard = ({cardTitle, orders, color, markAsReceived, markAsCanceled, markAsDone}) => {
    

    if(!orders && orders.length === 0){
        return <Text>Loading..</Text>
    }

    const formatTime = (timeString) => {
        return moment(timeString).format('HH:mm');
    }

    const calculateRemainingTime = (createdAt, estimatedTime) => {
        const estimatedMinutes = parseInt(estimatedTime.split(' ')[0], 10);
        
        // Calculate the time difference between the current time and the order creation time
        const orderCreatedTime = moment(createdAt);
        const now = moment();
        const elapsedMinutes = Math.floor(moment.duration(now.diff(orderCreatedTime)).asMinutes());

        // Subtract elapsed time from the estimated time
        const remainingMinutes = estimatedMinutes - elapsedMinutes;

        return remainingMinutes > 0 ? `${remainingMinutes} min left` : 'Time expired';
    };


    return (
        <View style={styles.container}>
            
            <View style={styles.header}>
                
                <View style={[styles.titleRow, {backgroundColor: color}]}>
                    <Text style={{fontSize: 16, fontWeight: "bold"}}>{cardTitle}</Text>
                    <Text>Icon..</Text>
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

            <ScrollView style={{flex: 1}}>
                
                {orders.map((order) => {
                    const [remainintTime, setRemainingTime] = useState(calculateRemainingTime(order.createdAt, order.estimatedTime))

                    useEffect(() => {
                        const interval = setInterval(() => {
                            setRemainingTime(calculateRemainingTime(order.createdAt, order.estimatedTime));
                        }, 60000)

                        return () => clearInterval(interval);
                    }, []);

                    return(
                        <View key={order.id} style={styles.orderCard}>
                            <View style={styles.row}>
                                <Text style={styles.orderCardText}>{formatTime(order.createdAt)}</Text>
                                <Text style={styles.orderCardText}>#{order.orderNumber}</Text>
                                <Text style={styles.orderCardText}>${order.totalAmount}</Text>
                                
                                {cardTitle === 'Preparing' && (
                                    <Text style={styles.orderCardText}>{remainintTime}</Text>
                                )}
                            </View>
                            
                            <View style={styles.orderBtns}>
                                {cardTitle === 'Pending' && (
                                    <>
                                        <Pressable style={styles.addBtn} onPress={() => markAsReceived(order.id)}>
                                            <Text>Accept</Text>
                                        </Pressable>

                                        <Pressable style={styles.cancelBtn} onPress={() => markAsCanceled(order.id)}>
                                            <Text>Cancel</Text>
                                        </Pressable>
                                    </>
                                )}

                                {cardTitle === 'Preparing' && (
                                    <Pressable style={styles.addBtn} onPress={() => markAsDone(order.id)}>
                                        <Text>Mark as Done</Text>
                                    </Pressable>
                                )}
                            </View>

                        </View>
                    )
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