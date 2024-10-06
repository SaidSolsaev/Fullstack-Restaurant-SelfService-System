import React, {useRef, useState} from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import ProductCard from '../components/ProductCard'
import ScrollHelper from '../components/ScrollHelper'

const MainScreen = ({ route }) => {
    const {products} = route.params || {};
    const scrollRef = useRef(null);
    const [activeCategory, setActiveCategory] = useState('burgers');
    
    if (!products || products.length === 0) {
        return <Text>No products available</Text>;
    }

    const handleCategoryPress = (category) => {
        setActiveCategory(category);
        ScrollHelper.scrollToCategory(scrollRef, category);
    }; 

    const burgerProducts = products.filter(p => p.categoryId=== 1);
    const sidesProducts = products.filter(p => p.categoryId === 4);
    const dessertProducts = products.filter(p => p.categoryId === 3);
    const drinkProducts = products.filter(p => p.categoryId === 2);


    return (
        <View style={styles.container}>
            {/* Kategori-knapper */}
            <View style={styles.categoryContainer}>
            <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        activeCategory === 'burgers' && styles.activeCategoryButton
                    ]}
                    onPress={() => handleCategoryPress('burgers')}
                >
                    <Text
                        style={[
                            styles.categoryText,
                            activeCategory === 'burgers' && styles.activeCategoryText
                        ]}
                    >
                        Burgers
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        activeCategory === 'sides' && styles.activeCategoryButton
                    ]}
                    onPress={() => handleCategoryPress('sides')}
                >
                    <Text
                        style={[
                            styles.categoryText,
                            activeCategory === 'sides' && styles.activeCategoryText
                        ]}
                    >
                        Sides
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        activeCategory === 'desserts' && styles.activeCategoryButton
                    ]}
                    onPress={() => handleCategoryPress('desserts')}
                >
                    <Text
                        style={[
                            styles.categoryText,
                            activeCategory === 'desserts' && styles.activeCategoryText
                        ]}
                    >
                        Desserts
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        activeCategory === 'drinks' && styles.activeCategoryButton
                    ]}
                    onPress={() => handleCategoryPress('drinks')}
                >
                    <Text
                        style={[
                            styles.categoryText,
                            activeCategory === 'drinks' && styles.activeCategoryText
                        ]}
                    >
                        Drinks
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Scrollable view for produktene */}
            <ScrollView ref={scrollRef} style={styles.scrollView}>
                <View>
                    {/* Burgers */}
                    <Text style={styles.categoryTitle} id="burgers">Burgers</Text>
                    <View style={styles.cardContainer}>
                        {burgerProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </View>

                    {/* Sides */}
                    <Text style={styles.categoryTitle} id="sides">Sides</Text>
                    <View style={styles.cardContainer}>
                        {sidesProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </View>

                    {/* Desserts */}
                    <Text style={styles.categoryTitle} id="desserts">Desserts</Text>
                    <View style={styles.cardContainer}>
                        {dessertProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </View>

                    {/* Drinks */}
                    <Text style={styles.categoryTitle} id="drinks">Drinks</Text>
                    <View style={styles.cardContainer}>
                        {drinkProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default MainScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFEBCD',
        padding: 10,
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
        // backgroundColor: '#FF6347',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    categoryButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        // backgroundColor: '#FF6347',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeCategoryButton: {
        backgroundColor: '#FF6347',
    },
    categoryText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    activeCategoryText: {
        fontSize: 18, 
        fontWeight: 'bold',
        color: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    categoryTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
        padding: 25,
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',  // For å fordele kortene jevnt over skjermen
        padding: 5,
    },
});