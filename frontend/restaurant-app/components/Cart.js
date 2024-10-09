import React, {useContext} from 'react'
import { StyleSheet, Text, View, Pressable, ScrollView, Platform} from 'react-native'
import { CartContext } from '../context/CartContext'
import CartItem from './CartItem'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Cart = ({navigation}) => {
    const {cartItems, getTotalPrice} = useContext(CartContext)

    return (
        <View style={styles.cartContainer}>
            <View style={styles.cartTitleContainer}>
                <View>
                    <MaterialIcons name="shopping-basket" size={50} color="#FF6347" />
                </View>
            </View>
            
            <ScrollView style={styles.scrollview} showsVerticalScrollIndicator={false}>    
                <View style={styles.cartItemsContainer}>
                    {cartItems.length === 0 ? (
                        <Text>Add items to Cart</Text>
                        ) : (
                            cartItems.map((item) => (
                                <CartItem key={item.id} item={item}/>
                            ))
                        )
                    }
                </View>
            </ScrollView>
            
            <View style={styles.cartCheckoutContainer}>
                <Text style={styles.totalPrice}>Total: ${getTotalPrice()}</Text>
                    
                {cartItems.length > 0 && (
                    <Pressable onPress={() => navigation.navigate('Checkout')}>
                        <MaterialIcons style={styles.cartButton} name="shopping-cart-checkout" size={24} color="white" />
                    </Pressable>
                )}
            </View>
        </View>
    )
}

export default Cart

const styles = StyleSheet.create({
    cartContainer: {
        width: "30%", 
        
        backgroundColor: '#FAEBD7',
        borderLeftWidth: 1,
        borderLeftColor: '#ddd',
        flexDirection: 'column',
        justifyContent: 'space-between',
        
    },
    cartTitleContainer: {
        paddingVertical: 6.8,
        paddingHorizontal: 30,
        marginBottom: 10,
        borderBottomWidth: 1,
        flexDirection: 'row',
        borderBottomColor: '#ddd',
        justifyContent: "flex-end",
        alignItems: "center"
    },
    cartItemsContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "flex-start",
        gap: 10,
    },
    cartButton:{
        backgroundColor: '#FF6347',
        color: 'white',
        padding: 10,
        textAlign: 'center',
        borderRadius: 50,
    },    
    cartCheckoutContainer:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollview: {
        flex: 1,
        ...(Platform.OS === 'web' && {
            '::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
        }),
    }
})