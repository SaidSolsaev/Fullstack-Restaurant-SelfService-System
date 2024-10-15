import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { handleLogin, handleLogout } from '../service/api/loginService';
import { Platform } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const saveToken = async (token) => {
        if (Platform.OS === 'web') {
            localStorage.setItem('access_token', token);
        } else {
            await SecureStore.setItemAsync('access_token', token);
        }
    };

    const getToken = async () => {
        if (Platform.OS === 'web') {
            return localStorage.getItem('access_token');
        } else {
            return await SecureStore.getItemAsync('access_token');
        }
    };

    const removeToken = async () => {
        if (Platform.OS === 'web') {
            localStorage.removeItem('access_token');
        } else {
            await SecureStore.deleteItemAsync('access_token');
        }
    };

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await getToken();

            if (token) {
                setIsLoggedIn(true);
                
            }else {
                setIsLoggedIn(false);
            }
            setIsLoading(false);
        }
        checkLoginStatus();
    }, []);

    const login = async (email, password) => {
        const result = await handleLogin(email, password);
        
        if (result && result.access_token) {
            await saveToken(result.access_token);
            setIsLoggedIn(true);
            setError(null);
            navigation.replace('MainScreen')
        }else if(result && result.error){
            setError(result.error)
        }
    }

    const logout = async () => {
        await handleLogout();
        await removeToken();
        setIsLoggedIn(false);
        
    };

    return (
        <AuthContext.Provider value={{error, isLoggedIn, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}