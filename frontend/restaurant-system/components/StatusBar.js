import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'

const {width} = Dimensions.get('window');

const StatusBar = ({label, count, color}) => {
    
    return (
        <View style={[styles.statusTabContainer, {backgroundColor: color}]}>
            <Text style={styles.name}>{label}</Text>
            
            <View style={styles.countContainer}>
                <Text>{count}</Text>
            </View>
        </View>
    )
}

export default StatusBar

const styles = StyleSheet.create({
    statusTabContainer: {
        width: width * 0.22,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
        gap: 20,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold"
    },
    countContainer:{
        alignItems: "center",
        justifyContent: "center",
    },

})