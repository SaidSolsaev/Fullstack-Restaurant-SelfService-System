import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from "jwt-decode";


const URL = Platform.OS === 'web' 
    ? 'http://localhost:3000'
    : 'https://miserably-clever-toucan.ngrok-free.app'
;

const getRestaurantIdFromToken = async () => {
    try {
        const token = await getToken('deviceToken');

        if (token){
            const decodedToken = jwtDecode(token);
            const restaurantId = decodedToken.restaurantId;
            return restaurantId
        } else {
            console.error("No token found");
            return null;
        }
    } catch (error) {
        console.error("Error decoding token: ", error)
        return null;
    }
};

export const saveToken = async (key, value) => {
    if (Platform.OS === 'web'){
        localStorage.setItem(key, value);
    } else {
        await SecureStore.setItemAsync(key, value)
    }
};

export const getToken = async (key) => {
    if (Platform.OS === 'web') {
        return localStorage.getItem(key);
    } else {
        return await SecureStore.getItemAsync(key);
    }
};

export const deleteToken = async (key) => {
    if (Platform.OS === 'web') {
        localStorage.removeItem(key);
    } else {
        await SecureStore.deleteItemAsync(key);
    }
};

export const getRestaurantInfo = async () => {
    try {
        const restaurantId = await getRestaurantIdFromToken();
        const token = await getToken('deviceToken');

        const response = await fetch(`${URL}/api/restaurants`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'restaurant-id': restaurantId,
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

        await saveToken('deviceToken', data.token);

        return { success: true, token: data.token };
    } catch (error) {
        console.error('Error during login:', error);
        return { success: false, error: 'An error occurred during login' };
    }
}

export const getMenuItems = async () => {
    try {
        const restaurantId = await getRestaurantIdFromToken();
        const token = await getToken('deviceToken');

        const response = await fetch(`${URL}/api/menu-items`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'restaurant-id': restaurantId
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
        const restaurantId = await getRestaurantIdFromToken();
        const token = await getToken('deviceToken');

        const response = await fetch(`${URL}/api/categories`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'restaurant-id': restaurantId
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

        const restaurantId = await getRestaurantIdFromToken();
        const token = await getToken('deviceToken');


        const response = await fetch(`${URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'restaurant-id': restaurantId
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