import axios from 'axios';
import { Platform } from 'react-native';
import moment from 'moment'; 


const API_URL = Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'https://miserably-clever-toucan.ngrok-free.app';


const isToday = (dateString) => {
    const today = moment().startOf('day');
    const orderDate = moment(dateString);
    return orderDate.isSame(today, 'day');
}

const sortOrdersByDate = (orders) => {
    return orders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

export const fetchOrdersFromAPI = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/orders`);
        const orders = response.data;

        const todaysOrders = orders.filter(order => isToday(order.createdAt));

        const sortedOrders = sortOrdersByDate(todaysOrders);

        return sortedOrders;
    } catch (error) {
        console.error('Error fetching orders from API:', error);
        return null;
    }
};

export const updateOrderStatus = async (status, orderId, estimatedTime = 30) => {
    try {
        const response = await axios.put(`${API_URL}/api/orders/${orderId}`, {
            status: status,
            estimatedTime: `${estimatedTime} min`,
        });

        return response.data;
    } catch (error) {
        console.error('Error updating order status:', error);
        return null;
    }
};


