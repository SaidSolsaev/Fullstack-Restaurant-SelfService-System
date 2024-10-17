import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { deviceLogin } from '../services/api/getRestaurantInfo.js';

const DeviceLogin = ({ onLoginSuccess }) => {
    const [deviceName, setDeviceName] = useState('');
    const [deviceKey, setDeviceKey] = useState('');
    


    const handleLogin = async () => {
        if (!deviceName || !deviceKey) {
            console.log('Device Name or Device Key is missing.');
            return;
        }
        try {
            const response = await deviceLogin(deviceName, deviceKey);
            

            if (response.success === true) {
                
                onLoginSuccess();
            } else {
                Alert.alert('Login failed', 'Please check your credentials and try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while logging in. Please try again.');
        }
    };

    return (
        <View>
            <TextInput 
                placeholder="Device Name"
                value={deviceName}
                onChangeText={setDeviceName}
            />
            <TextInput 
                placeholder="Device Key"
                value={deviceKey}
                onChangeText={setDeviceKey}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

export default DeviceLogin;
