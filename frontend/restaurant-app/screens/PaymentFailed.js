import { StyleSheet, Text, View } from 'react-native'
import React from 'react'



const PaymentFailed = ({route}) => {
    const {phoneNumber} = route.params;

    console.log('Inside Payment Failed, params: ', phoneNumber);


    return (
        <View>
            <Text>PaymentFailed</Text>
        </View>
    )
}

export default PaymentFailed

const styles = StyleSheet.create({

})