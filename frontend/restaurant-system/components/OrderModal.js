import { StyleSheet, Text, View, Modal, Pressable, ScrollView, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const OrderModal = ({ isVisible, onClose, order }) => {
    if (!order) return null;

    console.log(order)

    const totalPriceAddOns = () => {
        let total = 0;


        order.orderItems?.forEach(item => {
            if (item.addOns && item.addOns.length > 0){
                item.addOns.forEach(addOn => {
                    total += addOn.price || 0;
                });
            }
        });

        return total.toFixed(2);
    }

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType='slide'
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalContainer}>

                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            {/* Close Icon */}
                            <Pressable style={styles.closeIcon} onPress={onClose}>
                                <Ionicons name="close" size={24} color="black" />
                            </Pressable>

                            {/* Order Number as Title */}
                            <Text style={styles.title}>Order #{order.orderNumber}</Text>

                            {/* Table Headers */}
                            <View style={styles.tableHeader}>
                                <Text style={styles.headerText}>Name</Text>
                                <Text style={styles.headerText}>Qty</Text>
                                <Text style={styles.headerText}>Add-ons</Text>
                                <Text style={styles.headerText}>Price</Text>
                            </View>

                            {/* Order Items List */}
                            <ScrollView style={styles.scrollView}>
                                {order.orderItems?.map((item, index) => (
                                    <View key={index} style={styles.tableRow}>
                                        <Text style={styles.itemText}>{item.MenuItem?.name}</Text>
                                        <Text style={styles.itemText}>{item.quantity}</Text>
                                        <Text style={styles.itemText}>
                                            {item.addOns?.length > 0 ? item.addOns.map(a => a.name).join(',\n') : 'No Add-ons'}
                                        </Text>
                                        <Text style={styles.itemText}>${item.MenuItem?.price}</Text>
                                    </View>
                                ))}
                            </ScrollView>

                            {/* Total */}
                            <View style={styles.totalContainer}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalLabel}>{order.orderItems?.length} items</Text>
                                <Text style={styles.totalAmount}>${totalPriceAddOns()}</Text>
                                <Text style={styles.totalAmount}>${order.totalAmount}</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default OrderModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '60%',
        maxHeight: '60%',
    },
    closeIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
        zIndex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 10,
    },
    headerText: {
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    scrollView: {
        flexGrow: 0,
        marginBottom: 20,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    itemText: {
        flex: 1,
        textAlign: 'center',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    totalLabel: {
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    totalAmount: {
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    
});
