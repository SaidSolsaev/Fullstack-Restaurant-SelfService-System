import { Pressable, StyleSheet, Text, View, FlatList, TextInput, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { getAllOrders } from '../service/api/ordersService';
import { Picker } from '@react-native-picker/picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateRangePicker from '../components/DateRangePicker';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import OrderModal from '../components/OrderModal';

const {width} = Dimensions.get('screen');

const OrderHistoryScreen = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOptions, setSortOptions] = useState('newest');
    const [statusFilter, setStatusFilter] = useState('all')
    const [dateRange, setDateRange] = useState({startDate: null, endDate: null});
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [datesReset, setDatesReset] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        const fetchOrders = async () => {
            const orderList = await getAllOrders();
            orderList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(orderList);
            setFilteredOrders(orderList);
    
            navigation.setOptions({
                headerRight: ()=>
                    <Text style={styles.headerRightText}>Total orders: {orderList.length}</Text>,
                }
            );
        }
        
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [searchQuery, sortOptions, statusFilter, dateRange]);

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    };

    const handleDateChange = (range) => {
        setDateRange(range);
    };

    const formatDateTime = (date) => {
        const d = new Date(date);
        const dateString = d.toLocaleDateString("nb");
        const time = d.toLocaleTimeString("nb")

        return `${dateString} ${time}`;
    }

    const handleReset = () => {
        setDateRange({startDate: null, endDate: null})
        setStatusFilter('all');
        setSortOptions('');
        setDatesReset(true);
    }


    const filterOrders = () => {
        let filtered = [...orders];

        if (searchQuery){
            filtered = filtered.filter(order => 
               order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
            );
            console.log(filtered)
        }

        if (statusFilter !== 'all'){
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        if (dateRange.startDate || dateRange.endDate) {
            filtered = filtered.filter(order => {
                const orderDate = formatDate(order.createdAt);
                const start = dateRange.startDate ? formatDate(dateRange.startDate) : null;
                const end = dateRange.endDate ? formatDate(dateRange.endDate) : null;

                if (start && orderDate < start) return false;
                if (end && orderDate > end) return false;
                return true;
            });
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


    //Order Modal
    const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const openOrderModal = (order) => {
        setSelectedOrder(order);
        setIsOrderModalVisible(true);
    };

    const closeOrderModal = () => {
        setIsOrderModalVisible(false);
        setSelectedOrder(null);
    };

    

    const renderOrderItem = ({item}) => {
        const getStatusColor = (status) => {
            switch (status.toLowerCase()){
                case 'pending':
                    return '#FFC107';
                case 'preparing':
                    return '#2196F3';
                case 'done':
                    return '#4CAF50';
                case 'delivered':
                    return 'purple';
                case 'canceled':
                    return 'red';
                default:
                    return '#ccc';
            }
        }

        return (
            <Pressable 
                style={[styles.orderItem, {borderLeftColor: getStatusColor(item.status)}]} 
                onPress={() => handleOrderPress(item.id)}
            >
                
                <View style={styles.orderItemHeader}>
                    <Text style={styles.orderText}>Order #{item.orderNumber}</Text>
                </View>
                
                <View style={styles.orderItemBody}>
                    <View style={styles.orderInfo}>
                        {/* <Text style={styles.orderText}>Status: {item.status}</Text> */}
                        <Text style={{fontSize: 14, fontWeight: 300,}}>{formatDateTime(item.createdAt)}</Text>
                    </View>
                
                    <View style={styles.orderActions}>
                        <Pressable>
                            <Ionicons name="print-sharp" size={18} color="black" />
                        </Pressable>
                        
                        <Pressable onPress={() => openOrderModal(item)}>
                            <AntDesign name="eye" size={18} color="black" />
                        </Pressable>
                    </View>
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
                onChangeText={(value) => setSearchQuery(value)}
                placeholderTextColor="#fff"
            />

            <View style={styles.filterContainer}>

                <View style={styles.filterItemContainer}>
                    <Text style={{fontWeight: "600", marginBottom: 5, color: "#fff"}}>Sort by</Text>
                    <Picker
                        selectedValue={sortOptions}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSortOptions(itemValue)}
                        placeholder='Sort By'
                    >
                        <Picker.Item label="Newest to Oldest" value="newest" />
                        <Picker.Item label="Oldest to Newest" value="oldest" />
                    </Picker>
                </View>

                <View style={styles.filterItemContainer}>
                    <Text style={{fontWeight: "600", marginBottom: 5, color: "#fff"}}>Status</Text>
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

                <View style={styles.filterItemContainer}>
                    <Text style={{marginBottom: 10, fontWeight: "600", color: "#fff"}}>Select Dates</Text>
                    <Pressable onPress={() => setIsDatePickerVisible(true)}>
                        <FontAwesome5 name="calendar-alt" size={40} color="white" />
                    </Pressable>

                    <DateRangePicker
                        isVisible={isDatePickerVisible}
                        onClose={() => setIsDatePickerVisible(false)}
                        onChange={handleDateChange}
                        shouldReset={datesReset}
                    />
                </View>

                <Pressable style={styles.removeFilterBtn} onPress={() => handleReset()}>
                    <Text style={{fontWeight: "600", color: "#fff"}}>Clear filters</Text>
                </Pressable>
            </View>

            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderOrderItem}
                numColumns={3}
            />

            <OrderModal 
                isVisible={isOrderModalVisible}
                onClose={closeOrderModal}
                order={selectedOrder}
            />
        </View>
    )
}

export default OrderHistoryScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#333',
    },
    orderItemList:{
        justifyContent: "space-between",
        width: "100%"
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        color: "#fff",
        width: "50%",
        alignSelf: "center"
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        alignItems: "center",
        marginBottom: 10,
    },
    picker: {
        height: 40,
        padding: 10,
        width: 200,
        backgroundColor: "#fff",
    },
    orderItem: {
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        width: width * 0.30,
        margin: 12,
        justifyContent: "space-between",
        borderLeftWidth: 15,
    },
    orderItemHeader: {
        width: "100%",
        padding: 12,
    },
    orderItemBody: {
        width: "100%",
        padding: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end"
    },
    orderText: {
        fontSize: 16,
        textAlign: "center",
        fontWeight: "700"
    },
    orderActions:{
        flexDirection: "row",
        gap: 10,

    },
    headerRightText: {
        marginRight: 20,
        fontSize: 18,
        textAlign: "center",
        color: '#fff',
        fontWeight: "500"
    },
    filterItemContainer: {
        alignItems: "center",
        padding: 15,
        flexDirection: 'column',
        marginHorizontal: 20
    },
    removeFilterBtn: {
        padding: 12,
        backgroundColor: "#ff674d",
        borderRadius: 10,
        alignSelf: "center"
    }
})