import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const GraphsContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    width: 100%;
    margin: 20px 0;
`;

const GraphWrapper = styled.div`
    width: 50%;
    max-height: 400px;

    @media (max-width: 768px) {
        height: 300px;
    }
`;

const FilterButtons = styled.div`
    display: flex;
    gap: 10px;
    margin: 20px 0;
    justify-content: center;

    button {
        background-color: ${({ theme }) => theme.primaryButton};
        color: ${({ theme }) => theme.primaryButtonText};
        padding: 8px 12px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;

        &:hover {
            background-color: ${({ theme }) => theme.primaryButtonHover};
        }

        &.active {
            font-weight: bold;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }
    }
`;

const OrdersGraphs = ({orders}) => {
    const [view, setView] = useState('daily');

    const filteredData = useMemo(() => {
        const dates = {};
        let totalRevenue = 0;
        let totalOrders = 0;

        orders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const key =
            view === 'daily'
            ? orderDate.toLocaleDateString()
            : view === 'weekly'
            ? `${orderDate.getFullYear()}-W${Math.ceil(orderDate.getDate() / 7)}`
            : `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;

            if (!dates[key]) {
                dates[key] = { revenue: 0, count: 0 };
            }

            dates[key].revenue += parseFloat(order.totalAmount);
            dates[key].count += 1;
            totalRevenue += parseFloat(order.totalAmount);
            totalOrders += 1;
        });

        const labels = Object.keys(dates);
        const revenueData = labels.map((key) => dates[key].revenue);
        const ordersData = labels.map((key) => dates[key].count);
        const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

        return {
            labels,
            revenueData,
            ordersData,
            avgOrderValue,
        };
    }, [orders, view]);

    const revenueChartData = {
        labels: filteredData.labels,
        datasets: [
            {
                label: 'Daily Revenue',
                data: filteredData.revenueData,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.3)',
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    const orderTrendChartData = {
        labels: filteredData.labels,
        datasets: [
            {
                label: 'Number of Orders',
                data: filteredData.ordersData,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.5)',
                borderWidth: 2,
                fill: true,
            },
        ],
      };

    return (
        <>
            <GraphsContainer>
                
                <GraphWrapper>
                    
                        <h3>Daily Revenue</h3>
                        <Line data={revenueChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    
                </GraphWrapper>

                <GraphWrapper>
                        <h3>Order Trends</h3>
                        <Bar data={orderTrendChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </GraphWrapper>
            </GraphsContainer>

            <FilterButtons>
                <button onClick={() => setView('daily')} className={view === 'daily' ? 'active' : ''}>Daily</button>
                <button onClick={() => setView('weekly')} className={view === 'weekly' ? 'active' : ''}>Weekly</button>
                <button onClick={() => setView('monthly')} className={view === 'monthly' ? 'active' : ''}>Monthly</button>
            </FilterButtons>

            <h3>Average Order Value: ${filteredData.avgOrderValue}</h3>
        </>

    )
}

export default OrdersGraphs