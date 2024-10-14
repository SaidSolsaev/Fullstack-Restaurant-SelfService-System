import { Pressable, StyleSheet, Text, View, TextInput, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';


const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useContext(AuthContext);
    const navigation = useNavigation();

    const onLoginPress = async () => {
        await login(email, password);
        navigation.replace('MainScreen');
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

                <Pressable style={styles.loginBtn} onPress={onLoginPress}>
                    <Text>Login</Text>
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
        backgroundColor: "#888"
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
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
        borderRadius: 20
    }
    
})