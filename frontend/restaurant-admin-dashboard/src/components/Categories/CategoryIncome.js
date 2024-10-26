import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchOrders } from '../../redux/slices/orderSlice';
import {Pie} from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
  } from 'chart.js';
  
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryIncomeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    background-color: ${({ theme }) => theme.cardBackground};
    border-radius: 10px;
    box-shadow: ${({ theme }) => theme.boxShadow};
    width: 100%;

    @media (max-width: 768px) {
        padding: 15px;
    }

    .category-selector {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        overflow-x: auto;
        margin-bottom: 20px;
        padding: 10px;
        
        button {
            padding: 8px 12px;
            cursor: pointer;
            background-color: none;
            background: none;
            color: ${({ theme }) => theme.text};
            border: none;
            border-radius: 5px;
            white-space: nowrap;

            &.active {
                color: ${({ theme }) => theme.textHover};
            }

            &:hover {
                color: ${({ theme }) => theme.textHover};
            }
        }
    }

    .info-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        
        .income {
            font-size: 1.5rem;
            font-weight: bold;
        }
        
        .sold-items {
            font-size: 1.2rem;
            color: ${({ theme }) => theme.secondaryText};
        }
    }

    .chart-section {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;

        .chart-container {
            max-width: 300px;
            width: 100%;
        }
    }
`;

const CategoryIncome = ({ categories }) => {
    const dispatch = useDispatch();
    const { orders } = useSelector((state) => state.orders);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const categoryData = useMemo(() => {
        if (!orders || !categories) return [];

        return categories.map(category => {
            const categoryOrders = orders.filter(order => 
                ['delivered', 'done'].includes(order.status) &&
                order.orderItems.some(item => item.MenuItem.Category.id === category.id)
            );

            const totalIncome = categoryOrders.reduce((sum, order) => {
                const orderIncome = order.orderItems
                    .filter(item => item.MenuItem.Category.id === category.id)
                    .reduce((itemSum, item) => itemSum + parseFloat(item.MenuItem.price) * item.quantity, 0);
                return sum + orderIncome;
            }, 0);

            const totalItemsSold = categoryOrders.reduce((count, order) => 
                count + order.orderItems
                    .filter(item => item.MenuItem.Category.id === category.id)
                    .reduce((itemCount, item) => itemCount + item.quantity, 0),    
            0);

            return {
                id: category.id,
                name: category.name,
                totalIncome,
                totalItemsSold
            };
        })
    }, [orders, categories]);

    const totalItemsSoldAllCategories = categoryData.reduce(
        (sum, cat) => sum + cat.totalItemsSold,
        0
    );

    const totalIncomeAllCategories = categoryData.reduce((sum, cat) => sum + cat.totalIncome, 0);

    const pieChartData = useMemo(() => {
        
        return {
            labels: categoryData.map(cat => cat.name),
            datasets: [
                {
                    data: categoryData.map(cat => cat.totalIncome),
                    backgroundColor: ['#4CAF50', '#FFB74D', '#FF7043', '#42A5F5', '#9E9E9E'],
                    hoverBackgroundColor: ['#388E3C', '#FFA726', '#F4511E', '#1E88E5', '#757575']
                }
            ],
        };
    }, [categoryData]);

    const handleCategorySelect = (categoryId) => {
        const category = categoryData.find(cat => cat.id === categoryId);
        setSelectedCategory(category);
    };
    
    return (
        <CategoryIncomeWrapper>
            <div className="category-selector">
                {categoryData.map(category => (
                    <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className={selectedCategory?.id === category.id ? 'active' : ''}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            
                <div className="info-section">
                    {selectedCategory ? (
                        <>
                            <div className="income">
                                Total Income: ${selectedCategory.totalIncome.toFixed(2)}
                            </div>
                            <div className="sold-items">
                                Total Sold Items: {selectedCategory.totalItemsSold}
                            </div>
                        </>
                    ): (
                        <>
                            <div className="income">
                                Total Income: ${totalIncomeAllCategories.toFixed(2)}
                            </div>
                            <div className="sold-items">
                                Total Sold Items: {totalItemsSoldAllCategories}
                            </div>
                        </>
                    )}
                </div>

            <div className='chart-section'>
                <div className='chart-container'>
                    <Pie
                        data={pieChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(tooltipItem) {
                                            const label = pieChartData.labels[tooltipItem.dataIndex];
                                            const value = pieChartData.datasets[0].data[tooltipItem.dataIndex];
                                            return `${label}: $${value.toFixed(2)}`;
                                        }
                                    }
                                },
                            },
                        }}
                    />
                </div>
            </div>

        </CategoryIncomeWrapper>
    )
}

export default CategoryIncome