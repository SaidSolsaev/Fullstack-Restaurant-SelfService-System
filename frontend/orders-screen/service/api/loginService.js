import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from "jwt-decode";


const URL = Platform.OS === 'web' 
    ? 'http://localhost:3000'
    : 'https://miserably-clever-toucan.ngrok-free.app'
;

export const getRestaurantIdFromToken = async () => {
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