import { Pressable, StyleSheet, Text, View, FlatList, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { getAllOrders } from '../service/api/ordersService';
import { Picker } from '@react-native-picker/picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';

const OrderHistoryScreen = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOptions, setSortOptions] = useState('');
    const [statusFilter, setStatusFilter] = useState('all')

    const navigation = useNavigation();

    useEffect(() => {
        const fetchOrders = async () => {
            const orderList = await getAllOrders();
            setOrders(orderList);
            setFilteredOrders(orderList);
        }
        
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [searchQuery, sortOptions, statusFilter]);

    const filterOrders = () => {
        let filtered = [...orders];

        if (searchQuery){
            filtered == filtered.filter(order => 
               order.orderNumber.toLowerCase().includes(searchQuery.toUpperCase())
            );
        }

        if (statusFilter !== 'all'){
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);

            if (sortOptions === 'newest'){
                return dateB - dateA
            } else {
                return dateA - dateB
            }
        });

        setFilteredOrders(filtered);
    }


    const handleOrderPress = (orderId) => {
        console.log("Clicked order: ", orderId)
    }

    const renderOrderItem = ({item}) => {
        return (
            <Pressable style={styles.orderItem} onPress={() => handleOrderPress(item.id)}>
                <View>
                    <Text style={styles.orderText}>Order #{item.orderNumber}</Text>
                    <Text style={styles.orderText}>Total: ${item.totalAmount}</Text>
                    <Text style={styles.orderText}>Status: {item.status}</Text>
                </View>
                
                <View style={styles.actionContainer}>
                    <Pressable>
                        <Ionicons name="print-sharp" size={24} color="black" />
                    </Pressable>
                    
                    <Pressable>
                        <AntDesign name="eye" size={24} color="black" />
                    </Pressable>
                </View>
            </Pressable>
        )
    }
    
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder='Search by Order Number...'
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <View style={styles.filterContainer}>
                <Text>Sort by:</Text>
                <Picker
                    selectedValue={sortOptions}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSortOptions(itemValue)}
                >
                    <Picker.Item label="Newest to Oldest" value="newest" />
                    <Picker.Item label="Oldest to Newest" value="oldest" />
                </Picker>

                {/* Status Filter */}
                <Text>Status:</Text>
                <Picker
                    selectedValue={statusFilter}
                    style={styles.picker}
                    onValueChange={(itemValue) => setStatusFilter(itemValue)}
                >
                    <Picker.Item label="All" value="all" />
                    <Picker.Item label="Pending" value="pending" />
                    <Picker.Item label="Delivered" value="delivered" />
                    <Picker.Item label="Done" value="done" />
                    <Picker.Item label="Canceled" value="canceled" />
                    <Picker.Item label="Preparing" value="preparing" />
                </Picker>
            </View>

            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderOrderItem}
            />
        </View>
    )
}

export default OrderHistoryScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    picker: {
        height: 40,
        width: 150,
    },
    orderItem: {
        padding: 16,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    orderText: {
        fontSize: 16,
    },
})