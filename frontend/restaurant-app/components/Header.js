import React, { useContext } from 'react';
import { Pressable, StyleSheet, View, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CartContext } from '../context/CartContext';
import Ionicons from '@expo/vector-icons/Ionicons'; 

const Header = () => {
    const navigation = useNavigation();
    const {clearCart} = useContext(CartContext);
    
    const handleHomePress = () => {
        if (Platform.OS === 'web'){
            const confirmQuit = window.confirm(
                "Are you sure you want to quit? Your order will be canceled, and your cart will be cleared.",
            )

            if (confirmQuit){
                clearCart();
                navigation.navigate('Home')
            }
        } else {
            Alert.alert(
                "Quit Order?",
                "Are you sure you want to quit? Your order will be canceled, and your cart will be cleared.",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    {
                        text: "Confirm",
                        onPress: () => {
                          clearCart();
                          navigation.navigate('Home');
                        },
                        style: "destructive"
                    }
                ],
                {cancelable: true}
            );
        }
    };

    return (
        
        <Pressable onPress={handleHomePress} style={styles.homeIcon}>
            <Ionicons name='home-sharp' size={28} color="#FF6347"/>
        </Pressable>
        
    )
}

export default Header

const styles = StyleSheet.create({
    homeIcon: {
        marginLeft: 15,
    },
})