import { Modal, StyleSheet, Text, View, Dimensions, Pressable, ScrollView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Audio} from "expo-av";
import { generatePDF } from '../helpers/generatePdf';


const {width} = Dimensions.get('screen')

const NewOrderModal = ({isVisible, onConfirm, onCancel, orderDetails}) => {
    const [sound, setSound] = useState();
    const [selectedTime, setSelectedTime] = useState(null);
    const times = [10, 15, 20, 25, 30, 45, 60, 90];


    useEffect(() => {
        if (isVisible){
            playSound();
        }

        return () => {
            stopSound();
        };
    }, [isVisible]);

    const playSound = async () => {
        const {sound} = await Audio.Sound.createAsync(
            require('../assets/new-order-alert.mp3'),
            {shouldPlay: true, isLooping: true}
        );
        setSound(sound);
        await sound.playAsync();
    };

    const stopSound = async () => {
        if (sound){
            await sound.stopAsync();
        };
    };

    const handleConfirm = () => {
        stopSound();
        generatePDF(orderDetails);
        onConfirm(selectedTime);
    };
    
    const handleCancel = () => {
        stopSound();
        onCancel();
    };


    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType='slide'
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ScrollView style={{marginBottom: 20, width: '100%'}}>
                        <Text style={styles.prepTitle}>Order #{orderDetails?.orderNumber}</Text>
                        <Text style={styles.prepTitle}>Total Amount: ${orderDetails?.totalAmount}</Text>

                        {orderDetails?.orderItems?.map((item, index) => (
                            <View key={index} style={styles.menuItemRow}>
                                <Text style={styles.menuItemName}>{item.MenuItem?.name}</Text>
                                <Text style={styles.menuItemQuantity}>{item.quantity}x</Text>
                                
                                {item.addOns?.length > 0 && (
                                    <Text  key={`${item.MenuItem.id}-addon-${index}`} style={styles.menuItemAddOns}>
                                        +{item.addOns.map(a => a.name).join(', ')}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </ScrollView>

                    <Text style={styles.prepTitle}>PREPARATION (MINS)</Text>
                    <View style={styles.timeContainer}>
                        {times.map((time) => (
                            <Pressable
                                key={time}
                                onPress={() => setSelectedTime(time)}
                                style={[styles.timeButton, selectedTime === time && styles.selectedTimeButton]}
                            >
                                <Text>{time}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <Pressable style={styles.confirmButton} onPress={handleConfirm}>
                        <Text style={styles.buttonText}>CONFIRM</Text>
                    </Pressable>
            
                    <Pressable style={styles.cancelButton} onPress={handleCancel}>
                        <Text style={styles.buttonText}>CANCEL</Text>
                    </Pressable>
            
                </View>
            </View>

        </Modal>
    )
}

export default NewOrderModal

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: width * 0.5,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        maxHeight: 600,
    },
    prepTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
    },
    menuItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
        paddingHorizontal: 10,
    },
    menuItemName: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    menuItemQuantity: {
        fontSize: 16,
        color: '#333',
    },
    menuItemAddOns: {
        fontSize: 14,
        color: '#666',
        marginLeft: 10,
    },
    timeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    timeButton: {
        backgroundColor: '#ccc',
        width: 80,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderRadius: 5,
    },
    selectedTimeButton: {
        backgroundColor: '#2196F3',
    },
    confirmButton: {
        backgroundColor: 'green',
        width: '100%',
        padding: 15,
        borderRadius: 5,
        marginVertical: 10,
    },
    cancelButton: {
        backgroundColor: 'red',
        width: '100%',
        padding: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
})