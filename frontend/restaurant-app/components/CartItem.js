import React, {useContext}  from 'react'
import { StyleSheet, Text, View, Pressable, Image, } from 'react-native'
import { CartContext } from '../context/CartContext'
import Ionicons from '@expo/vector-icons/Ionicons';
import burger from "../assets/burger.png";
import dessert from "../assets/dessert.png";
import drink from "../assets/drink.png";
import fries from "../assets/fries.png";

const CartItem = ({item}) => {
    const {increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext)
    
    let exampleProduct = null;

    if (item.Category.name === 'Burgers'){
        exampleProduct = burger;
    } else if(item.Category.name === 'Drinks'){
        exampleProduct = drink;
    } else if(item.Category.name === 'Desserts'){
        exampleProduct = dessert;
    }else {
        exampleProduct = fries;
    }
    
    return (
        <View key={`${item.id}-${JSON.stringify(item.addOns)}`} style={styles.cartItem}>
            
            <Image
                source={exampleProduct}
                style={styles.itemImage}
                resizeMode="contain"
            />
            
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.totalPrice}</Text>
                {item.addOns.length > 0 && (
                    <Text style={styles.itemAddOns}>{item.addOns.map(a => a.name).join(', ')}</Text>
                )}
            </View>
            
            <View style={styles.cartControls}>
                <Pressable onPress={() => decreaseQuantity(item.id, item.addOns)}>
                    <Ionicons name="remove-circle-sharp" size={24} color="#FF6347" />
                </Pressable>
                
                <Text style={styles.quantityText}>{item.quantity}</Text>
                
                <Pressable onPress={() => increaseQuantity(item.id, item.addOns)}>
                    <Ionicons name="add-circle-sharp" size={24} color="#FF6347"/>
                </Pressable>
                
                <Pressable onPress={() => removeFromCart(item.id, item.addOns)}>
                    <Ionicons name="trash-sharp" size={24} color="#FF6347" style={{marginHorizontal: 5}}/>
                </Pressable>
            </View>

        
        </View>
    )
}

export default CartItem

const styles = StyleSheet.create({
    cartItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    itemImage: {
        width: 60,
        height: 60,
        flex: 0.5, 
    },
    itemInfo: {
        flex: 2,
        marginRight: 10,
        gap: 3,
        alignItems: "center"
    },
    itemName: {
        fontSize: 14,
        fontWeight: "600",
    },
    itemPrice: {
        fontSize: 14,
        color: '#777',
    },
    itemAddOns: {
        fontSize: 12,
        color: '#999',
    },
    cartControls: {
        flexDirection: 'row',
        justifyContent: "flex-end",
        alignItems: "center"
    },
    
    quantityText:{
        fontSize: 16,
        fontWeight: "bold",
        marginHorizontal: 5,
    },
    
})