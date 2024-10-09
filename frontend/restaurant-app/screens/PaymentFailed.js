import { StyleSheet, Text, View } from 'react-native'
import React from 'react'



const PaymentFailed = ({route}) => {
    const {phoneNumber, paymentSuccess} = route.params;

    console.log('Inside Payment Failed, params: ', phoneNumber, paymentSuccess);


    return (
        <View>
            <Text>PaymentFailed</Text>
        </View>
    )
}

export default PaymentFailed

const styles = StyleSheet.create({

})