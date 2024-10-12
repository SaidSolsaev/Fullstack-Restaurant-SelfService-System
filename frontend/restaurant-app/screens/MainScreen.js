import React, {useRef, useState, useEffect, useContext} from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable, Platform, findNodeHandle } from 'react-native'
import ProductCard from '../components/ProductCard'
import ScrollHelper from '../components/ScrollHelper'
import { getCategories } from '../services/api/getRestaurantInfo'
import Cart from '../components/Cart'
import { CartContext } from '../context/CartContext'
import ProductModal from '../components/ProductModal'


const MainScreen = ({ route, navigation }) => {
    
    const {products} = route.params || {};
    const scrollRef = useRef(null);
    const burgerRef = useRef(null);
    const sidesRef = useRef(null);
    const dessertsRef = useRef(null);
    const drinksRef = useRef(null);
    const [activeCategory, setActiveCategory] = useState('burgers');
    const [categories, setCategories] = useState(null);
    const {addToCart} = useContext(CartContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await getCategories();
                
                if(response){
                    const drinksCategory = response.find(category => category.name === 'Drinks');
                    const otherCategories = response.filter(category => category.name !== 'Drinks');
                
                    setCategories([...otherCategories, drinksCategory]);
                }
            } catch (error) {
                console.error('Failed to fetch Category info:', error);
            }
        }
        fetchCategories();
    }, [])

    
    if (!products || products.length === 0 || !categories) {
        return <Text>No products available</Text>;
    }

    const scrollToCategoryIOS = (category) => {
        setActiveCategory(category);

        let categoryRef;
        switch (category) {
            case 'burgers':
                categoryRef  = burgerRef;
                break;
            case 'sides':
                categoryRef  = sidesRef;
                break;
            case 'desserts':
                categoryRef  = dessertsRef;
                break;
            case 'drinks':
                categoryRef  = drinksRef;
                break;
            default:
                return;
        }

        categoryRef.current.measureLayout(
            findNodeHandle(scrollRef.current),
            (x, y) => {
                scrollRef.current.scrollTo({ y, animated: true });
            }
        )
    };

    const handleCategoryPress = (category) => {
        setActiveCategory(category);

        if (Platform.OS === 'ios' || Platform.OS === 'android'){
            scrollToCategoryIOS(category);
        } else if(Platform.OS === 'web'){
            ScrollHelper.scrollToCategory(scrollRef, category);
        }
    };

    const openModal = (product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    const handleAddToCart = (product, addOns = []) => {
        addToCart(product, addOns)
    }

    const closeModal = () => {
        setModalVisible(false);
    }

    const burgerProducts = products.filter(p => p.Category.name === 'Burgers');
    const sidesProducts = products.filter(p => p.Category.name === 'Sides');
    const dessertProducts = products.filter(p => p.Category.name === 'Desserts');
    const drinkProducts = products.filter(p => p.Category.name === 'Drinks');

    return (
        <View style={styles.container}>

            <View style={styles.mainContainer}>

                {/* Categories */}
                <View style={styles.categoryContainer}>
                    {categories.map((category) => (
                        <Pressable
                            key={category.id}
                            style={[
                                styles.categoryButton,
                                activeCategory === category.name.toLowerCase() && styles.activeCategoryButton
                            ]}
                            onPress={() => handleCategoryPress(category.name.toLowerCase())}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    activeCategory === category.name.toLowerCase() && styles.activeCategoryText
                                ]}
                                > 
                                {category.name}
                            </Text>
                        </Pressable>
                    ))}
                </View>


                {/* Menu Items */}
                <View style={styles.productContainer}>
                    <ScrollView ref={scrollRef} style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View>
                            <Text ref={burgerRef} style={styles.categoryTitle} id="burgers">Burgers</Text>
                            <View style={styles.cardContainer}>
                                {burgerProducts.map(product => (
                                    <ProductCard key={product.id} product={product} openModal={openModal}/>
                                ))}
                            </View>

                            <Text ref={sidesRef} style={styles.categoryTitle} id="sides">Sides</Text>
                            <View style={styles.cardContainer}>
                                {sidesProducts.map(product => (
                                    <ProductCard key={product.id} product={product} openModal={openModal}/>
                                ))}
                            </View>

                            <Text ref={dessertsRef} style={styles.categoryTitle} id="desserts">Desserts</Text>
                            <View style={styles.cardContainer}>
                                {dessertProducts.map(product => (
                                    <ProductCard key={product.id} product={product} openModal={openModal}/>
                                ))}
                            </View>

                            <Text ref={drinksRef} style={styles.categoryTitle} id="drinks">Drinks</Text>
                            <View style={styles.cardContainer}>
                                {drinkProducts.map(product => (
                                    <ProductCard key={product.id} product={product} openModal={openModal}/>
                                ))}
                            </View>
                        </View>
                    </ScrollView>
                </View>

                <ProductModal 
                    visible={modalVisible}
                    product={selectedProduct}
                    onClose={closeModal}
                    onAddToCart={handleAddToCart}
                />
            </View>

            {/* Cart */}
            <Cart navigation={navigation}/>
        </View>
    )
}

export default MainScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFEBCD',
        padding: 0,
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    categoryButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
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

    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },

    productContainer: {
        flex: 2,
        padding: 10,
    },
    scrollView: {
        flex: 1,
        ...(Platform.OS === 'web' && {
            '::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
        }),
    },
    categoryTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 50,
        paddingHorizontal: 25,
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        padding: 5,
        
    },
});