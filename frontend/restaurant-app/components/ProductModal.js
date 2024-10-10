import { Modal, StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React from 'react'
import burger from "../assets/burger.png";
import dessert from "../assets/dessert.png";
import drink from "../assets/drink.png";
import fries from "../assets/fries.png";

const ProductModal = ({visible, product, onClose, onAddToCart}) => {
    if (!product) return <Text>No product!</Text>;

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
    
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType='slide'
            onRequestClose={onClose}
        >

            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Image source={exampleProduct} style={styles.image} resizeMode="contain"/>
                    

                    <View style={styles.modalProductInfo}>
                        <Text style={styles.modalTitle}>{product.name}</Text>
                        <Text style={styles.modalPrice}>${product.price}</Text>
                        <Text style={styles.modalDescription}>{product.description}</Text>
                    </View>

                

                    <Pressable
                        style={styles.addToCartButton}
                        onPress={() => {
                            onAddToCart(product);
                            onClose();
                        }}
                    >
                        <Text style={styles.addToCartText}>Add to Cart</Text>
                    </Pressable>

            
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                </View>
            </View>

        </Modal>
    )
}

export default ProductModal

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '60%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalPrice: {
        fontSize: 18,
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    addToCartButton: {
        backgroundColor: '#FF6347',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#ddd',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    closeButtonText: {
        fontSize: 16,
        color: '#333',
    },

    modalProductInfo: {

    },

    modalImageContainer: {

    },

    image: {
        width: '100%',
        height: '50%',
        borderRadius: 10,
    },
})