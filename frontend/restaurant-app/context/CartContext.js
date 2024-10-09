import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartReady, setIstCartReady] = useState(false);
    
    useEffect(() => {
        const loadCart = async () => {
            try {
                const storedCart = await AsyncStorage.getItem('@cartItems');
                if (storedCart !== null){
                    setCartItems(JSON.parse(storedCart));
                }
            } catch (error) {
                console.error('Failed to load cart from AsyncStorage', error)
            } finally{
                setIstCartReady(true);
            }
        };

        loadCart();
    }, []);

    const saveCart = async (newCart) => {
        try {
            await AsyncStorage.setItem('@cartItems', JSON.stringify(newCart));
        } catch (error) {
            console.error('Failed to save cart to AsyncStorage', error)
        }
    };

    const clearCart = () => {
        setCartItems([]);
        AsyncStorage.removeItem('@cartItems');
    }

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
            let updatedCart;

            if (existingItemIndex >= 0){
                updatedCart = [...prevItems];
                updatedCart[existingItemIndex].quantity += 1;
                
            } else{
                updatedCart = [...prevItems, {...product, quantity: 1}];
            }

            saveCart(updatedCart);
            return updatedCart;
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => {
            const updatedCart = prevItems.filter(item => item.id !== productId)
            saveCart(updatedCart);
            return updatedCart;
        });
    };

    const increaseQuantity = (productId) => {
        setCartItems((prevItems) => {
            const updatedCart = [...prevItems];
            const itemIndex = updatedCart.findIndex(item => item.id === productId);
            if (itemIndex >= 0) {
                updatedCart[itemIndex].quantity += 1;
            }
            saveCart(updatedCart);
            return updatedCart;
        });
    };

    const decreaseQuantity = (productId) => {
        setCartItems((prevItems) => {
            const updatedCart = [...prevItems];
            const itemIndex = updatedCart.findIndex(item => item.id === productId);
            console.log(itemIndex)
            
            if (itemIndex >= 0) {
                const item = updatedCart[itemIndex];
                if (item.quantity > 1) {
                    updatedCart[itemIndex].quantity -= 1;
                } else {
                    updatedCart.splice(itemIndex, 1);
                }
            }

            saveCart(updatedCart);
            return updatedCart;
        });
    };

    const getTotalPrice = () => {
        const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        return parseFloat(total.toFixed(2));
    };

    

    return (
        <CartContext.Provider value={{clearCart, isCartReady, cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice }}>
            {children}
        </CartContext.Provider>
    );
};
