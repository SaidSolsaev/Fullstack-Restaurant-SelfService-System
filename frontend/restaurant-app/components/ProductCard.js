import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import { CartContext } from '../context/CartContext';
import burger from "../assets/burger.png";
import dessert from "../assets/dessert.png";
import drink from "../assets/drink.png";
import fries from "../assets/fries.png";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


const { width } = Dimensions.get('window');

const ProductCard = ({ product, openModal }) => {
    const { addToCart } = useContext(CartContext);
    let exampleProduct = null;

    if (product.Category.name === 'Burgers'){
        exampleProduct = burger;
    } else if(product.Category.name === 'Drinks'){
        exampleProduct = drink;
    } else if(product.Category.name === 'Desserts'){
        exampleProduct = dessert;
    }else {
        exampleProduct = fries;
    }

    const handleAddToCart = (product, addOn = []) => {
        addToCart(product, addOn)
    }

    return (
        <Pressable style={styles.card} onPress={() => openModal(product)}>
            <Image source={exampleProduct} style={styles.image} resizeMode="contain"/>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>${product.price}</Text>

            <View style={styles.addButtonContainer}>
                <Pressable style={styles.addButton} onPress={() => handleAddToCart(product)}>
                    <Text>
                        <FontAwesome6 name="cart-plus" size={20} color="white" />
                    </Text>
                </Pressable>
            </View>
        </Pressable>
    );
};

export default ProductCard;

const styles = StyleSheet.create({
    card: {
        flexBasis: width > 1200 ? '22%' : width > 800 ? '30%' : '45%',
        aspectRatio: 1,
        backgroundColor: '#fff',
        padding: 16,
        margin: 8,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
        justifyContent: 'space-between',
    },
    addButtonContainer:{
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    addButton: {
        
        padding: 8,
        backgroundColor: "#FF6347",
        
        borderRadius: 5,
    },
    image: {
        width: '100%',
        height: '50%',
        borderRadius: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    price: {
        fontSize: 14,
        color: '#777',
        marginBottom: 5,
    },
});
