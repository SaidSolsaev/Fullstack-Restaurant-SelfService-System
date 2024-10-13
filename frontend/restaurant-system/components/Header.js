import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'



const Header = () => {

    return (
        <View style={styles.container}>
            <View style={styles.leftSide}>
                <Text style={styles.logo}>Burgers Place</Text>
                <Text style={styles.time}>15:51</Text>
            </View>

            <View style={styles.rightSide}>

                <Pressable style={styles.headerBtn}>
                    <Text>Order History</Text>
                </Pressable>

                <Pressable style={styles.headerBtn}>
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