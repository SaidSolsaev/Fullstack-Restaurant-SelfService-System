import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getRestaurantInfo } from '../services/api/getRestaurantInfo.js';

const MenuScreen = ({ route }) => {
    const [menuItems, setMenuItems] = useState([]);
    const { restaurant } = route.params;

    useEffect(() => {
        async function fetchMenuItems() {
            try {
                // Anta at restaurant.menuId brukes for å hente menyen
                const response = await fetch(`http://localhost:3000/api/menu-items`);
                const json = await response.json();
                setMenuItems(json);
            } catch (error) {
                console.error('Failed to fetch menu items:', error);
            }
        }

        fetchMenuItems();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Menu</Text>
            <FlatList
                data={menuItems}
                keyExtractor={(item) => item.id.toString()}
                
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{item.name} - ${item.price}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default MenuScreen;
