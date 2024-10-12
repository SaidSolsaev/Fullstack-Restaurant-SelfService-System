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

    const addToCart = (product, addOns = []) => {
        const productPrice = parseFloat(product.price);
        const addOnsTotalPrice = addOns.reduce((total, addOn) => total + parseFloat(addOn.price), 0);
        const totalPrice = (productPrice + addOnsTotalPrice).toFixed(2);
        

        setCartItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(item => 
                item.id === product.id && JSON.stringify(item.addOns) === JSON.stringify(addOns)
            );
            
            let updatedCart;
    
            if (existingItemIndex >= 0) {
                updatedCart = [...prevItems];
                updatedCart[existingItemIndex].quantity += 1;
                updatedCart[existingItemIndex].totalPrice = (parseFloat(updatedCart[existingItemIndex].totalPrice) + parseFloat(totalPrice)).toFixed(2);;
            } else {
                updatedCart = [...prevItems, { ...product, quantity: 1, addOns, totalPrice }];
            }
    
            saveCart(updatedCart);
            return updatedCart;
        });
    };
    


    const removeFromCart = (productId, addOns = []) => {
        setCartItems((prevItems) => {
            const updatedCart = prevItems.filter(item => 
                !(item.id === productId && JSON.stringify(item.addOns) === JSON.stringify(addOns))
            );

            saveCart(updatedCart);
            return updatedCart;
        });
    };

    const removeAddOnFromItem = (productId, addOn, addOns) => {
        setCartItems((prevItems) => {
            const updatedCart = [...prevItems];
            const itemIndex = updatedCart.findIndex(item => 
                item.id === productId && JSON.stringify(item.addOns) === JSON.stringify(addOns)
            );
    
            if (itemIndex >= 0) {
                const item = updatedCart[itemIndex];
                const addOnToRemove = item.addOns.find(a => a.name === addOn);
                if (addOnToRemove) {
                    item.addOns = item.addOns.filter(existingAddOn => existingAddOn.name !== addOn);
                    item.totalPrice -= addOnToRemove.price;
                }
            }
    
            saveCart(updatedCart);
            return updatedCart;
        });
    };

    const increaseQuantity = (productId, addOns = []) => {
        setCartItems((prevItems) => {
            const updatedCart = [...prevItems];
            const itemIndex = updatedCart.findIndex(item => 
                item.id === productId && JSON.stringify(item.addOns) === JSON.stringify(addOns)
            );
    
            if (itemIndex >= 0) {
                const item = updatedCart[itemIndex];
                const productPrice = parseFloat(item.price);
                const addOnsTotalPrice = item.addOns.reduce((total, addOn) => total + parseFloat(addOn.price), 0);
                const totalPrice = (productPrice + addOnsTotalPrice).toFixed(2);
    
                updatedCart[itemIndex].quantity += 1;
                updatedCart[itemIndex].totalPrice = (parseFloat(updatedCart[itemIndex].totalPrice) + parseFloat(totalPrice)).toFixed(2);;
            }
    
            saveCart(updatedCart);
            return updatedCart;
        });
    };
    

    const decreaseQuantity = (productId, addOns = []) => {
        setCartItems((prevItems) => {
            const updatedCart = [...prevItems];
            const itemIndex = updatedCart.findIndex(item => 
                item.id === productId && JSON.stringify(item.addOns) === JSON.stringify(addOns)
            );
    
            if (itemIndex >= 0) {
                const item = updatedCart[itemIndex];
                const productPrice = parseFloat(item.price);
                const addOnsTotalPrice = item.addOns.reduce((total, addOn) => total + parseFloat(addOn.price), 0);
                const totalPrice = (productPrice + addOnsTotalPrice).toFixed(2);;
    
                if (item.quantity > 1) {
                    updatedCart[itemIndex].quantity -= 1;
                    updatedCart[itemIndex].totalPrice = (parseFloat(updatedCart[itemIndex].totalPrice) - parseFloat(totalPrice)).toFixed(2);
                } else {
                    updatedCart.splice(itemIndex, 1);
                }
            }
    
            saveCart(updatedCart);
            return updatedCart;
        });
    };
    

    const getTotalPrice = () => {
        const total = cartItems.reduce((total, item) => total + item.totalPrice * item.quantity, 0);
        return parseFloat(total.toFixed(2));
    };

    

    return (
        <CartContext.Provider value={{removeAddOnFromItem, clearCart, isCartReady, cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice }}>
            {children}
        </CartContext.Provider>
    );
};
