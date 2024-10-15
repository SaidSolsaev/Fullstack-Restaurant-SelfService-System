import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Pressable, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const DateRangePicker = ({ isVisible, onClose, onChange, shouldReset }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(moment()); 

    useEffect(() => {
        if (shouldReset){
            setStartDate(null);
            setEndDate(null);
        };
    }, [shouldReset]);

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const generateMonthDates = (month) => {
        const startOfMonth = month.clone().startOf('month');
        const endOfMonth = month.clone().endOf('month');
        const days = [];

        const startDayOfWeek = startOfMonth.isoWeekday();
        
        for (let i = 1; i < startDayOfWeek; i++) {
            days.push(null);
        }

        
        for (let day = 1; day <= endOfMonth.date(); day++) {
            days.push(moment(month).date(day));
        }

        const totalDays = days.length;
        const reminder = totalDays % 7;

        if (reminder !== 0){
            const padding = 7 - reminder;
            
            for (let i = 0; i < padding; i++){
                days.push(null);
            }
        }

        return days;
    };

    const handleDatePress = (date) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
        } else if (date.isAfter(startDate) || date.isSame(startDate)) {
            setEndDate(date);
        }
    };

    const confirmSelection = () => {
        if (startDate && endDate) {
            onChange({ startDate, endDate });
            onClose();
        } else {
            alert('Please select a valid date range');
        }
    };

    const closeAndReset = () => {
        setStartDate(null);
        setEndDate(null);
        setCurrentMonth(moment())
        onClose();
    }


    const goToPreviousMonth = () => {
        setCurrentMonth(currentMonth.clone().subtract(1, 'months'));
    };

    const goToNextMonth = () => {
        setCurrentMonth(currentMonth.clone().add(1, 'months'));
    };

    return (
        <Modal visible={isVisible} transparent={true} animationType="fade">
            <TouchableWithoutFeedback onPress={closeAndReset}>
                <View style={styles.modalContainer}>

                    <TouchableWithoutFeedback>
                        <View style={styles.pickerContainer}>
                            <View style={styles.header}>
                                <TouchableOpacity onPress={goToPreviousMonth}>
                                    <MaterialIcons style={styles.arrow} name="keyboard-arrow-left" size={24} color="black" />
                                </TouchableOpacity>
                                <Text style={styles.title}>
                                    {currentMonth.format('MMMM YYYY')}
                                </Text>

                                <TouchableOpacity onPress={goToNextMonth}>
                                    <MaterialIcons style={styles.arrow} name="keyboard-arrow-right" size={24} color="black" />
                                </TouchableOpacity>
                            </View>

                            
                            <View style={styles.dayNamesContainer}>
                                {daysOfWeek.map((day) => (
                                    <Text key={day} style={styles.dayName}>
                                        {day}
                                    </Text>
                                ))}
                            </View>

                            <View style={styles.gridContainer}>
                                {generateMonthDates(currentMonth).map((item, index) => (
                                    <Pressable
                                        key={index}
                                        style={[
                                            styles.dateItem,
                                            item && startDate && item.isSame(startDate, 'day') ? styles.startDate : {},
                                            item && endDate && item.isSame(endDate, 'day') ? styles.endDate : {},
                                            item && startDate && endDate && item.isBetween(startDate, endDate, 'day', '[]') ? styles.inRangeDate : {},
                                            item && startDate && item.isBefore(startDate, 'day') ? styles.disabledDate : {},
                                        ]}
                                        onPress={() => item && !item.isBefore(startDate, 'day') && handleDatePress(item)}
                                        disabled={item && startDate && item.isBefore(startDate, 'day')}
                                    >
                                        {item ? (
                                            <Text 
                                                style={[
                                                    styles.dateText,
                                                    item && startDate && item.isBefore(startDate, 'day') ? styles.disabledText : {}
                                                ]}
                                            >
                                                
                                                {item.format('D')}
                                            </Text>
                                        ) : (
                                            <Text style={styles.dateText}></Text>
                                        )}
                                    </Pressable>
                                ))}
                            </View>

                            <View style={styles.footer}>
                                <TouchableOpacity
                                    style={[styles.confirmButton, !startDate || !endDate ? styles.disabledButton : {}]}
                                    onPress={confirmSelection}
                                    disabled={!startDate || !endDate}
                                >
                                    <Text style={styles.buttonText}>Confirm</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.cancelButton} onPress={closeAndReset}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default DateRangePicker;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
    },
    pickerContainer: {
        backgroundColor: '#fff',
        maxWidth: 400,
        borderRadius: 10,
        padding: 16,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    arrow: {
        fontSize: 24,
        paddingHorizontal: 10,
    },
    dayNamesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 10,
        width: '100%',
        
    },
    dayName: {
        color: '#aaa',
        width: 40,
        textAlign: 'center',
    },
    dateItem: {
        padding: 10,
        margin: 5,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
    },
    emptyDateItem: {
        padding: 10,
        margin: 5,
        width: 40,
        height: 40,
    },
    dateText: {
        fontSize: 16,
    },
    startDate: {
        backgroundColor: '#2196F3',
    },
    endDate: {
        backgroundColor: '#F44336',
    },
    inRangeDate: {
        backgroundColor: '#80D8FF',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
    },
    confirmButton: {
        backgroundColor: 'green',
        padding: 5,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        borderBottomColor: "#ccc",
        borderBottomWidth: 1 
    },
    disabledDate: {
        backgroundColor: '#f2f2f2',
        opacity: 0.5,
    },
    disabledText: {
        color: '#d3d3d3',
    }
});
