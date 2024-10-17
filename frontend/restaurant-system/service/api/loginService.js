import axios from "axios"
import { Platform } from "react-native";

const API_URL = Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'https://miserably-clever-toucan.ngrok-free.app'
;



export const handleLogin = async (email, password) => {
    try {

        const response = await axios.post(`${API_URL}/api/login`, {
            email,
            password
        });

        if (response.status === 200){
            const token = response.data.access_token;

            const restaurantResponse = await axios.get(`${API_URL}/api/restaurants-me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return {
                access_token: token,
                restaurant: restaurantResponse.data
            };
        } else{
            return null;
        }

    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            return { error: error.response.data.error };
        } else {
            return { error: 'An error occurred. Please try again.' };
        }
    }
}

export const handleLogout = async () => {
    try {
        const response = await axios.post(`${API_URL}/api/logout`);

        if (response.status === 200){
            return response.data;
        } else{
            return null;
        }

    
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            return { error: error.response.data.error };
        } else {
            return { error: 'An error occurred. Please try again.' };
        }
    }
}