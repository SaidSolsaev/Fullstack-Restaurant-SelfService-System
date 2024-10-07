import React, { useContext } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Platform } from 'react-native';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const CheckoutScreen = ({ navigation }) => {
    const { cartItems, getTotalPrice } = useContext(CartContext);

    return (
        <ScrollView style={styles.scrollview} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Your order</Text>
                {cartItems.map((item) => (
                    <CartItem key={item.id} item={item}/>
                ))}
                <Text style={styles.totalPrice}>Total: ${getTotalPrice()}</Text>

                <View style={styles.buttonsContainer}>

                    <Pressable 
                        style={styles.button}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back-outline" size={24} color="#fff" />
                    </Pressable>
                    
                    <Pressable 
                        style={styles.button}
                        onPress={() => navigation.navigate('PhoneNumber')}
                    >
                        <MaterialIcons name="shopping-cart-checkout" size={24} color="#fff" />
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollview: {
        flex: 1,
        ...(Platform.OS === 'web' && {
            '::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
        }),
        backgroundColor: '#FFEBCD',

    },
    container: {
        flex: 1,
        padding: 20,

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    button: {
        padding: 15,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonsContainer: {
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10
    }
});

export default CheckoutScreen;
