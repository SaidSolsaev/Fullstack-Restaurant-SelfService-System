import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, ImageBackground, Button, TouchableOpacity, Image } from 'react-native'
import { getMenuItems, getRestaurantInfo } from '../services/api/getRestaurantInfo.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';


const HomeScreen = ({ navigation }) => {
    const [restaurant, setRestaurant] = useState(null);
    const [products, setProducts] = useState(null);

    useEffect(() => {
        async function fetchRestaurantInfo() {
            try {
                const storedRestaurant = await AsyncStorage.getItem('restaurantInfo');
                if (storedRestaurant){
                    setRestaurant(JSON.parse(storedRestaurant));
                } else{
                    const response = await getRestaurantInfo();
                    setRestaurant(response);

                    await AsyncStorage.setItem('restaurantInfo', JSON.stringify(response));
                }
            } catch (error) {
                console.error('Failed to fetch restaurant info:', error);
            }
        }

        async function fetchMenuItems() {
            try {
                const response = await getMenuItems();
                setProducts(response)
            } catch (error) {
                console.error('Failed to fetch product info:', error);
            }
        }

        fetchRestaurantInfo();
        fetchMenuItems();
    }, [])

    if (!restaurant || !products) {
        return <Text>Loading...</Text>;
    }
    
    return (
        <ImageBackground
            source={require('../assets/burger-background.jpg')}
            style={styles.background}
            resizeMode="fill"
        >

            <View style={styles.container}>
                
                <Text style={styles.restaurantName}>{restaurant.name}</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => navigation.navigate('Main', {products})}
                    >
                        <Ionicons name="restaurant-outline" size={24} color="white" />
                        <Text style={styles.buttonText}>Dine In</Text>
                    </TouchableOpacity>
                 
                    <TouchableOpacity style={styles.button}>
                        <Ionicons name="fast-food-outline" size={24} color="white" />
                        <Text style={styles.buttonText}>Takeaway</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    restaurantName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 50,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6347',
        padding: 15,
        borderRadius: 10,
        margin: 10,
    },
    
    buttonText: {
        color: 'white',
        fontSize: 18,
        marginLeft: 10,
    },
})