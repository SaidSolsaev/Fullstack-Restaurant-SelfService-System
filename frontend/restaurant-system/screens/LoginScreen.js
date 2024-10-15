import { Pressable, StyleSheet, Text, View, TextInput, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';


const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const {login, error, loading} = useContext(AuthContext);
    
    useEffect(() => {
        if (error){
            setShowError(true);
        }
    }, [error])

    useEffect(() => {
        const validEmail = email.includes('@');

        setIsButtonDisabled(!(email && password && validEmail));
    }, [email, password]);

    const onLoginPress = async () => {
        await login(email, password);
    }

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
                
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                    autoCapitalize="none"
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {showError && (
                    <Text style={styles.errorMessage}>{error}</Text>
                )}

                <Pressable 
                    style={[styles.loginBtn, isButtonDisabled ? styles.disabledButton : {}]} 
                    onPress={onLoginPress}
                    disabled={isButtonDisabled}
                >
                    <Text style={{color: "#fff", fontSize: 16, fontWeight: 500}}>Login</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default LoginScreen

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
    disabledButton: {
        backgroundColor: "#ccc",
    }
    
})