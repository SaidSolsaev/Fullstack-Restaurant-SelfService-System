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
            console.log('Login success', response.data);
            return response.data;
        } else{
            return null;
        }

    
    } catch (error) {
        console.error('Login error:', error);
        Alert.alert('Login Failed', 'An error occurred. Please try again.');
    }
}

export const handleLogout = async () => {
    try {
        const response = await axios.post(`${API_URL}/api/logout`);

        if (response.status === 200){
            console.log('Login success', response.data);
            return response.data;
        } else{
            return null;
        }

    
    } catch (error) {
        console.error('Login error:', error);
        Alert.alert('Login Failed', 'An error occurred. Please try again.');
    }
}