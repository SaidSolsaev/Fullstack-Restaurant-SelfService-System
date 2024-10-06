import AsyncStorage from '@react-native-async-storage/async-storage';

async function getStoredRestaurantInfo() {
    try {
        const storedRestaurant = await AsyncStorage.getItem('restaurantInfo');
        
        if (storedRestaurant) {
            return JSON.parse(storedRestaurant);
        }
    } catch (error) {
        console.error('Failed to load stored restaurant info:', error);
    }
    
    return null;
}