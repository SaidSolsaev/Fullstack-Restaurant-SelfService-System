import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable } from 'react-native'
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
                    if(response){
                        setRestaurant(response);
                        await AsyncStorage.setItem('restaurantInfo', JSON.stringify(response));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch restaurant info:', error);
            }
        }

        async function fetchMenuItems() {
            try {
                const response = await getMenuItems();
                
                if(response){
                    setProducts(response)
                }
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
                <View style={styles.buttonContainer}>
                    <Pressable 
                        style={styles.button}
                        onPress={() => navigation.navigate('Main', {products})}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons name="restaurant-outline" size={65} color="white" />
                        </View>

                        <View style={styles.buttonTextContainer}>

                            <Text style={styles.buttonText}>Dine In</Text>
                        </View>
                    </Pressable>
                 
                    <Pressable style={styles.button}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="fast-food-outline" size={70} color="white" />
                        </View>
                        
                        <View style={styles.buttonTextContainer}>
                            <Text style={styles.buttonText}>Takeaway</Text>
                        </View>
                    </Pressable>
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
        width: "100%",
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
        alignItems: "center",
        height: "25%",
        width: '30%',
        gap: 30,
    },
    
    button: {
        flexDirection: 'column',
        height: "100%",
        width: "50%",
        alignItems: 'center',
        backgroundColor: '#FF6347',
        padding: 15,
        borderRadius: 10,
    },
    buttonTextContainer: {
        height: "50%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    
    buttonText: {
        color: 'white',
        fontSize: 26,
        textAlign: "center",
    },
    iconContainer: {
        height: "50%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    }
})