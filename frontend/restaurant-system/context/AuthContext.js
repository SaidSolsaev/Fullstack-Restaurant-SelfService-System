import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { handleLogin, handleLogout } from '../service/api/loginService';
import { Platform } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [restaurant, setRestaurant] = useState(null);

    const saveToken = async (key, token) => {
        if (Platform.OS === 'web') {
            localStorage.setItem(key, token);
        } else {
            await SecureStore.setItemAsync(key, token);
        }
    };

    const getToken = async (key) => {
        if (Platform.OS === 'web') {
            return localStorage.getItem(key);
        } else {
            return await SecureStore.getItemAsync(key);
        }
    };

    const removeToken = async (key) => {
        if (Platform.OS === 'web') {
            localStorage.removeItem(key);
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    };

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await getToken('access_token');

            if (token) {
                setIsLoggedIn(true);
                
            }else {
                setIsLoggedIn(false);
            }
            setIsLoading(false);
        }

        const getRestaurantInfo = async() => {
            const savedRestaurant = await getToken("restaurant");

            if (savedRestaurant){
                setRestaurant(JSON.parse(savedRestaurant));
            }
        }

        checkLoginStatus();
        getRestaurantInfo();
    }, []);

    const login = async (email, password) => {
        const result = await handleLogin(email, password);
        
        if (result && result.access_token) {
            await saveToken("access_token", result.access_token);
            console.log("Login res", result.restaurant)
            await saveToken("restaurant", JSON.stringify(result.restaurant));
            setIsLoggedIn(true);
            setError(null);
            navigation.replace('MainScreen')
        } else if(result && result.error){
            setError(result.error)
        }
    }

    const logout = async () => {
        await handleLogout();
        await removeToken("access_token");
        await removeToken("restaurant");
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{error, isLoggedIn, isLoading, login, logout, restaurant}}>
            {children}
        </AuthContext.Provider>
    );
}