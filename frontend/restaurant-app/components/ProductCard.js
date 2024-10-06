import React, { useContext } from 'react';
import { View, Text, Image, Button, StyleSheet, Pressable } from 'react-native';
import { CartContext } from '../context/CartContext'; // Kontekst for handlekurven
import burger from "../assets/burger.png";
import dessert from "../assets/dessert.png";
import drink from "../assets/drink.png";
import fries from "../assets/fries.png";


const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    let exampleProduct = null;

    if (product.categoryId === 1){
        exampleProduct = burger;
    } else if(product.categoryId === 2){
        exampleProduct = drink;
    } else if(product.categoryId === 3){
        exampleProduct = dessert;
    }else {
        exampleProduct = fries;
    }

    const handleAddToCart = (product) => {
        addToCart(product)
        alert(product.name + " Added to cart!")
    }

    return (
        <View style={styles.card}>
            <Image source={exampleProduct} style={styles.image} resizeMode="fill"/>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>${product.price}</Text>

            <Pressable style={styles.addButton} onPress={() => handleAddToCart(product)}>
                <Text style={{color: "#fff", fontSize: "20px"}}>Bestill</Text>
            </Pressable>
        </View>
    );
};

export default ProductCard;

const styles = StyleSheet.create({
    card: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: '#fff',
        padding: 10,
        margin: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
        justifyContent: 'space-between',
    },
    addButton: {
        width: '100%',
        padding: 10,
        backgroundColor: "#FF6347",
        alignItems: "center",
        borderRadius: 5,
    },
    image: {
        width: '100%',
        height: '60%',
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
