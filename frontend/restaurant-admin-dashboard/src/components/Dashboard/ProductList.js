import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';


const ProductListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 48%;
    padding: 20px;
    max-width: 500px;
    gap: 20px;
    flex-wrap: wrap;
    background-color: ${({ theme }) => theme.cardBackground};
    box-shadow: ${({ theme }) => theme.boxShadow};
    margin: 20px 0;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const CategoryList = styled.ul`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
        cursor: pointer;
        padding: 10px;
        margin-bottom: 5px;
        border-radius: 5px;
        
        transition: background-color 0.3s ease;

        &:hover {
            background-color: ${({ theme }) => theme.primaryButtonHover};
        }
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const ProductList = styled.div`
    border-radius: 10px;
    max-width: 100%;


    ul {
        list-style-type: none;
        padding: 0;

        li {
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;
        }

        @media (max-width: 768px) {
            li {
                padding: 8px;
            }
        }
    }
`;

const TopSellingProducts = () => {
    const { orders } = useSelector((state) => state.orders);
    const [selectedCategory, setSelectedCategory] = useState(null);

    
    const { categories, topProductsByCategory } = useMemo(() => {
        const categorySales = {};
        const categoriesSet = new Set();
        orders.forEach((order) => {
            if (['approved', 'delivered'].includes(order.status)) {
                order.orderItems.forEach((item) => {
                    const productName = item.MenuItem.name;
                    const category = item.MenuItem.Category.name;

                    categoriesSet.add(category);

                    if (!categorySales[category]) {
                        categorySales[category] = {};
                    }

                    if (categorySales[category][productName]) {
                        categorySales[category][productName] += item.quantity;
                    } else {
                        categorySales[category][productName] = item.quantity;
                    }
                });
            }
        });

        
        Object.keys(categorySales).forEach((category) => {
            categorySales[category] = Object.entries(categorySales[category])
                .sort((a, b) => b[1] - a[1]) 
                .slice(0, 3);
        });

        return {
            categories: Array.from(categoriesSet),
            topProductsByCategory: categorySales,
        };
    }, [orders]);

    return (
        <ProductListWrapper>
            <h2>Top 3 Products in {selectedCategory || 'Select a Category'}</h2>

            {/* Category List */}
            <CategoryList>
                {categories.map((category, index) => (
                    <li key={index} onClick={() => setSelectedCategory(category)}>
                        {category}
                    </li>
                ))}
            </CategoryList>

            {/* Product List for the selected category */}
            <ProductList>
                {selectedCategory && topProductsByCategory[selectedCategory] ? (
                    <ul>
                        {topProductsByCategory[selectedCategory].map(([productName, quantity], index) => (
                            <li key={index}>
                                <strong>{productName}</strong>: {quantity} sold
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Please select a category to see the top products.</p>
                )}
            </ProductList>
        </ProductListWrapper>
    );
};

export default TopSellingProducts;
