import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';


const ProductListWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    width: 100%;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;


const ProductCard = styled.div`
    background-color: ${({ theme }) => theme.cardBackground};
    padding: 20px;
    border-radius: 10px;
    box-shadow: ${({ theme }) => theme.boxShadow};
    display: flex;
    flex-direction: column;

    h3 {
        margin-bottom: 10px;
        font-size: 1.2rem;
        text-align: center;
    }

    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;

        li {
            padding: 10px;
            font-size: 1rem;
        }
    }
`;

const TopSellingProducts = () => {
    const { orders } = useSelector((state) => state.orders);

    
    const topCategories = useMemo(() => {
        const categorySales = {};

        orders.forEach((order) => {
            if (['approved', 'delivered'].includes(order.status)) {
                order.orderItems.forEach((item) => {
                    const productName = item.MenuItem.name;
                    const category = item.MenuItem.Category.name;

                    if (!categorySales[category]) {
                        categorySales[category] = { total: 0, products: {} };
                    }

                    categorySales[category].total += item.quantity;

                    if (categorySales[category].products[productName]) {
                        categorySales[category].products[productName] += item.quantity;
                    } else {
                        categorySales[category].products[productName] = item.quantity;
                    }
                });
            }
        });

       
        const filteredCategories = Object.keys(categorySales)
            .filter((category) => categorySales[category].total >= 5)
            .slice(0, 4)
            .map((category) => {
                const topProducts = Object.entries(categorySales[category].products)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3);

                return { category, topProducts };
            });

        return filteredCategories;
    }, [orders]);

    return (
        <ProductListWrapper>
            {topCategories.map(({ category, topProducts }) => (
                <ProductCard key={category}>
                    <h3>Top 3 Products in {category}</h3>
                    <ul>
                        {topProducts.map(([productName, quantity], index) => (
                            <li key={index}>
                                <strong>{productName}</strong>: {quantity} sold
                            </li>
                        ))}
                    </ul>
                </ProductCard>
            ))}
        </ProductListWrapper>
    );
};

export default TopSellingProducts;
