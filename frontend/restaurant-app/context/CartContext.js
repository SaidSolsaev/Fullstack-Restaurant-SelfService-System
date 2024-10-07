import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(item => item.id === product.id);

            if (existingItemIndex >= 0){
                const updatedCart = [...prevItems];
                updatedCart[existingItemIndex].quantity += 1;
                return updatedCart;
            } else{
                return [...prevItems, {...product, quantity: 1}];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
    };

    const increaseQuantity = (productId) => {
        setCartItems((prevItems) => {
            const updatedCart = [...prevItems];
            const itemIndex = updatedCart.findIndex(item => item.id === productId);
            if (itemIndex >= 0) {
                updatedCart[itemIndex].quantity += 1;
            }
            return updatedCart;
        });
    };

    const decreaseQuantity = (productId) => {
        setCartItems((prevItems) => {
            const updatedCart = [...prevItems];
            const itemIndex = updatedCart.findIndex(item => item.id === productId);
            
            if (itemIndex >= 0) {
                const item = updatedCart[itemIndex];
                if (item.quantity > 1) {
                    updatedCart[itemIndex].quantity -= 1;
                } else {
                    
                    return updatedCart.filter(item => item.id !== productId);
                }
            }
            return updatedCart;
        });
    };

    const getTotalPrice = () => {
        const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        return parseFloat(total.toFixed(2));
    };

    

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice }}>
            {children}
        </CartContext.Provider>
    );
};
