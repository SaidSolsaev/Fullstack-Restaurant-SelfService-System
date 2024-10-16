import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { useNavigation } from '@react-navigation/native';
import {AuthContext} from "../context/AuthContext.js";


const Header = () => {
    const [currentTime, setCurrentTime] = useState(moment().format('HH:mm'));
    const navigation = useNavigation()
    const {logout, restaurant} = useContext(AuthContext)


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(moment().format('HH:mm'))
        }, 1000);

        return () => clearInterval(interval)
    }, [])

    const handleOrderHistyoryPress = () => {
        navigation.navigate("OrderHistory")
    }

    return (
        <View style={styles.container}>
            <View style={styles.leftSide}>
                <Text style={styles.logo}>{restaurant?.name}</Text>
                <Text style={styles.time}>{currentTime}</Text>
            </View>

            <View style={styles.rightSide}>

                <Pressable style={styles.headerBtn} onPress={handleOrderHistyoryPress}>
                    <Text>Order History</Text>
                </Pressable>

                <Pressable style={styles.headerBtn} onPress={logout}>
                    <Text>Log out</Text>
                </Pressable>

            </View>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 12,
        backgroundColor: "#ccc"
    },
    rightSide: {
        flexDirection: 'row',
        gap: 16,
        alignItems: "center"
    },
    leftSide: {
        flexDirection: 'row',
        gap: 22,
        alignItems: "center",
    },
    logo:{
        fontSize: 22,
        fontWeight: "bold"
    },
    headerBtn: {
        padding: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "transparent",
    }

})