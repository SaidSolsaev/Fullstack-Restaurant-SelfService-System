import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const ORDER_STORAGE_KEY = '@orders_storage';

const API_URL = Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'https://miserably-clever-toucan.ngrok-free.app'

export const fetchOrdersFromAPI = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/orders`);
        return response.data;
    } catch (error) {
        console.error('Error fetching orders from API:', error);
        return null;
    }
};

// Save orders to AsyncStorage
export const saveOrdersToStorage = async (orders) => {
    try {
        await AsyncStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
        console.error('Error saving orders to storage:', error);
    }
};

// Load orders from AsyncStorage
export const loadOrdersFromStorage = async () => {
    try {
        const storedOrders = await AsyncStorage.getItem(ORDER_STORAGE_KEY);
        return storedOrders ? JSON.parse(storedOrders) : null;
    } catch (error) {
        console.error('Error loading orders from storage:', error);
        return null;
    }
};