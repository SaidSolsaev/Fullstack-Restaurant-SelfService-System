import { Pressable, StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState } from 'react'
import {useNavigation} from "@react-navigation/native"
import { handleLogin } from '../service/api/loginService';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const onLoginPress = async () => {
        const loginData = await handleLogin(email, password);

        if (loginData){
            navigation.replace('MainScreen');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Pressable onPress={onLoginPress}>
                <Text>Login</Text>
            </Pressable>
        </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
})