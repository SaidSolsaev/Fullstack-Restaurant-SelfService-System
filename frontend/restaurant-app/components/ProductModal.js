import { Modal, StyleSheet, Text, View, Pressable, Image, Switch, ScrollView } from 'react-native'
import React, { useState } from 'react'
import burger from "../assets/burger.png";
import dessert from "../assets/dessert.png";
import drink from "../assets/drink.png";
import fries from "../assets/fries.png";
import { addOns } from '../assets/data/productExtras';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Checkbox from 'expo-checkbox';

const ProductModal = ({visible, product, onClose, onAddToCart}) => {
    const [selectedAddOns, setSelectedAddOns] = useState([]);

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

    const toggleAddOn = (addOn) => {
        if (selectedAddOns.some(a => a.name === addOn.name)) {
            setSelectedAddOns(selectedAddOns.filter(a => a.name !== addOn.name));
        } else {
            setSelectedAddOns([...selectedAddOns, addOn]);
        }
    };
    
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType='slide'
            onRequestClose={onClose}
        >

            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <Image source={exampleProduct} style={styles.image} resizeMode="contain"/>
                        

                        <View style={styles.modalProductInfo}>
                            <Text style={styles.modalTitle}>{product.name}</Text>
                            <Text style={styles.modalPrice}>${product.price}</Text>
                            <Text style={styles.modalDescription}>{product.description}</Text>
                        </View>

                        {/* Add-Ons Section */}
                        <View style={styles.addOnSection}>
                            <Text style={styles.addOnTitle}>Choose Add-Ons:</Text>
                            
                            <View style={styles.addOnsGrid}>
                                {addOns.map((addOn) => (
                                    <View key={addOn.name} style={styles.addOnItem}>
                                        <Checkbox
                                            value={selectedAddOns.some(a => a.name === addOn.name)}
                                            onValueChange={() => toggleAddOn(addOn)}
                                        />
                                        <Text style={styles.addOnName}>{addOn.name}</Text>
                                        <Text style={styles.addOnPrice}>${addOn.price.toFixed(2)}</Text>
                                    </View>
                                ))}
                            </View>
                        
                        </View>
                    </ScrollView>
                
                    <View style={styles.buttonSection}>
                        <Pressable
                            style={styles.addToCartButton}
                            onPress={() => {
                                onAddToCart(product, selectedAddOns);
                                setSelectedAddOns([]);
                                onClose();
                            }}
                        >
                            <Text style={styles.addToCartText}>
                                <FontAwesome6 name="cart-plus" size={28} color="white" />
                            </Text>
                        </Pressable>

                
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                    </View>
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
        width: '80%',
        height: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    scrollContainer: {
        flexGrow: 1,
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
    addOnTitle: {
        marginBottom: 20,
        fontWeight: 'bold',
    },
    addOnSection: {
        marginVertical: 20,
        width: '100%',
    },
    addOnsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    addOnItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 20
    },
    addOnName: {
        flex: 1,
        textAlign: 'left',
        marginLeft: 10,
    },
    addOnPrice: {
        textAlign: 'right',
    },
    addToCartButton: {
        backgroundColor: '#FF6347',
        padding: 12,
        borderRadius: 5,
        marginBottom: 10,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#ddd',
        padding: 12,
        borderRadius: 5,
        marginBottom: 10,
    },
    closeButtonText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 150, 
        borderRadius: 10,
    },
    buttonSection: {
        flexDirection: 'row-reverse',
        width: '100%',
        justifyContent: "space-between"
        
    }
})