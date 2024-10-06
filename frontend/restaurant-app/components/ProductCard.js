import React, { useContext } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
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

    return (
        <View style={styles.card}>
            <Image source={exampleProduct} style={styles.image} resizeMode="contain"/>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>${product.price}</Text>
            <Button 
                title="Bestill"
                onPress={() => addToCart(product)}
                color="#FF6347"
            />
        </View>
    );
};

export default ProductCard;

const styles = StyleSheet.create({
    card: {
        width: '30%',  // Gjør hvert kort 30% av bredden for å få plass til 3 på én rad
        aspectRatio: 1,  // Gjør kortet kvadratisk
        backgroundColor: '#fff',
        padding: 10,
        margin: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
        justifyContent: 'space-between',  // Sørg for at innholdet fordeles jevnt
    },
    image: {
        width: '100%',
        height: '60%',  // Gir bildet mesteparten av plassen
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
