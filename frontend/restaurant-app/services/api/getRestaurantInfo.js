import { Platform } from "react-native";

const URL = Platform.OS === 'web' 
    ? 'http://localhost:3000'
    : 'https://miserably-clever-toucan.ngrok-free.app'

export const getRestaurantInfo = async () => {
    try {
        const response = await fetch(`${URL}/api/restaurants/1`);
        const json = await response.json();
        
        return json;
    } catch (error) {
        console.error('Failed to fetch restaurant info:', error);
    }
};

export const getMenuItems = async () => {
    try {
       
        const response = await fetch(`${URL}/api/menu-items`);

        

        if(!response.ok){
            const text = await response.text();
            console.log('Error in get Menu items', text);
            return null;
        }
        
        const json = await response.json();
        
        return json;
    } catch (error) {
        console.error('Failed to fetch menu-items: ', error);
    }
}

export const getCategories = async () => {
    try {
        const response = await fetch(`${URL}/api/categories`);
        const json = await response.json();
        
        return json;
    } catch (error) {
        console.error('Failed to fetch categories: ', error);
    }
}

export const createOrderBackendCall = async (cartItems, phoneNumber, totalPrice) => {
    try {
        
        const formattedItems = cartItems.map(item => ({
            menuItemId: item.id,
            quantity: item.quantity,
            addOns: item.addOns
        }));

        console.log(formattedItems);

        const response = await fetch(`${URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: formattedItems,
                phoneNumber: phoneNumber,
                restaurantId: 1,
                totalAmount: totalPrice
            })
        });

        if (!response.ok) {
            console.error('Failed to create order:', response.statusText);
            return null
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error creating order:', error);
        return null;
    }
}