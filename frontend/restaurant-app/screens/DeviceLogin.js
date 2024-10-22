import React, { useState } from 'react';
import { View, TextInput,  Pressable, StyleSheet, Text, Image } from 'react-native';
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
        <View style={styles.container}>
            <View style={styles.leftSide}>
                <Image
                    source={require('../assets/burger-background.jpg')}
                    style={styles.background}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.rightSide}>
                <Text style={styles.title}>Login</Text>
                {errorMsg && (
                    <Text style={styles.errorMessage}>{errorMsg}</Text>
                )}
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

                <Pressable onPress={handleLogin} style={styles.loginBtn}>
                    <Text>Login</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default DeviceLogin;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: "row",
        backgroundColor: "#333"
    },
    leftSide: {
        width: "60%",
    },
    rightSide: {
        width: "40%",
        alignItems: "center",
        justifyContent: "center"
    },
    background: {
        width: '100%',
        height: '100%'
    },
    errorMessage: {
        color: "red",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: "#fff"
    },
    input: {
        height: 40,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    loginBtn: {
        padding: 12,
        backgroundColor: "green",
        borderRadius: 20,
        marginTop: 8
    },
})