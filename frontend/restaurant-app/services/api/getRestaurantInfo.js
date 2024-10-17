import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";

const URL = Platform.OS === 'web' 
    ? 'http://localhost:3000'
    : 'https://miserably-clever-toucan.ngrok-free.app'
;


export const getRestaurantInfo = async () => {
    try {
        const token = await SecureStore.getItemAsync('deviceToken'); 
        const response = await fetch(`${URL}/api/restaurants`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        const json = await response.json();
        
        return json;
    } catch (error) {
        console.error('Failed to fetch restaurant info:', error);
    }
};

export const deviceLogin = async (deviceName, deviceKey) => {

    try {
        const response = await fetch(`${URL}/api/devices/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                deviceName: deviceName,
                deviceKey: deviceKey
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
           
            return { success: false, error: errorData.message };
        }

        const data = await response.json();

        await SecureStore.setItemAsync('deviceToken', data.token);

        return { success: true, token: data.token };
    } catch (error) {
        console.error('Error during login:', error);
        return { success: false, error: 'An error occurred during login' };
    }
}

export const getMenuItems = async () => {
    try {
        const token = await SecureStore.getItemAsync('deviceToken');

        const response = await fetch(`${URL}/api/menu-items`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if(!response.ok){
            const text = await response.text();
            console.log('Error in get Menu items', text);
            return null;
        }
        
        const json = await response.json();
        
        return json;
    } catch (error) {
        console.error('Failed to fetch menu-items: ', error);
    }
}

export const getCategories = async () => {
    try {
        const token = await SecureStore.getItemAsync('deviceToken');
        const response = await fetch(`${URL}/api/categories`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        const json = await response.json();
        
        return json;
    } catch (error) {
        console.error('Failed to fetch categories: ', error);
    }
}

export const createOrderBackendCall = async (cartItems, phoneNumber, totalPrice) => {
    
    try {
        const formattedItems = cartItems.map(item => ({
            menuItemId: item.id,
            quantity: item.quantity,
            addOns: item.addOns
        }));

        const token = await SecureStore.getItemAsync('deviceToken');


        const response = await fetch(`${URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                items: formattedItems,
                phoneNumber: phoneNumber,
                totalAmount: totalPrice
            })
        });

        if (!response.ok) {
            console.error('Failed to create order:', response.statusText);
            return null
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error creating order:', error);
        return null;
    }
}