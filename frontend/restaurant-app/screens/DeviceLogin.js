import React, { useState } from 'react';
import { View, TextInput,  Pressable, StyleSheet, Text } from 'react-native';
import { deviceLogin } from '../services/api/getRestaurantInfo.js';


const DeviceLogin = ({ onLoginSuccess }) => {
    const [deviceName, setDeviceName] = useState('');
    const [deviceKey, setDeviceKey] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);


    const handleLogin = async () => {
        if (!deviceName || !deviceKey) {
            setErrorMsg("Fill in all fields");
            return;
        }

        try {
            const response = await deviceLogin(deviceName, deviceKey);
            

            if (response.success === true) {
                setErrorMsg(null);
                onLoginSuccess();
            } else {
                setErrorMsg('Login failed', 'Please check your credentials and try again.')
            }
        } catch (error) {
            setErrorMsg(error.message ? error.message : 'An error occurred while logging in. Please try again.')
        }
    };

    return (
        <View>
            <TextInput 
                placeholder="Device Name"
                value={deviceName}
                onChangeText={setDeviceName}
                style={styles.input}
            />
            <TextInput 
                placeholder="Device Key"
                value={deviceKey}
                onChangeText={setDeviceKey}
                secureTextEntry
                style={styles.input}
            />

            {errorMsg && (
                <Text style={styles.error}>{errorMsg}</Text>
            )}

            <Pressable onPress={handleLogin} style={styles.loginBtn}>
                <Text>Login</Text>
            </Pressable>
        </View>
    );
};

export default DeviceLogin;


const styles = StyleSheet.create({
    container: {

    },
    input:{

    },
    loginBtn: {

    },
    error: {

    }

})