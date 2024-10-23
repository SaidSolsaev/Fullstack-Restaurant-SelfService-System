import React, { useMemo } from 'react'
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styled from 'styled-components';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const ChartRow = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    align-items: center;
    margin: 0 auto;
    gap: 20px;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const ChartWrapper = styled.div`
    background-color: ${({ theme }) => theme.cardBackground};
    padding: 20px;
    border-radius: 10px;
    box-shadow: ${({ theme }) => theme.boxShadow};
    width: 48%;
    max-width: 100%;
    
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const MonthlyRevenueChart = () => {
    const {orders} = useSelector((state) => state.orders);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const {dailyRevenue, dailyOrders} = useMemo(() => {
        const revenueByDay = Array(31).fill(0);
        
        const ordersByDay = Array.from({ length: 31 }, () => ({
            pending: 0,
            canceled: 0,
            delivered: 0,
        }));
       

        orders.forEach((order) => {
            const orderDate = new Date(order.createdAt);
            const orderDay = orderDate.getDate() - 1;

            if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear){
                if (['delivered', 'done'].includes(order.status)){
                    revenueByDay[orderDay] += parseFloat(order.totalAmount);
                    ordersByDay[orderDay].delivered += 1;
                }

                if (order.status === 'pending') {
                    ordersByDay[orderDay].pending += 1;
                }
                
                if (order.status === 'canceled') {
                    ordersByDay[orderDay].canceled += 1;
                }
            }
        });

        return{
            dailyRevenue: revenueByDay.slice(0, new Date(currentYear, currentMonth + 1, 0).getDate()),
            dailyOrders: ordersByDay.slice(0, new Date(currentYear, currentMonth + 1, 0).getDate()),
        } 
    }, [orders, currentMonth, currentYear]);


    const revenueChartData  = {
        labels: dailyRevenue.map((_, index) => `Day ${index + 1}`),
        datasets: [
            {
                label: 'Daily Revenue',
                data: dailyRevenue,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ]
    };

    const ordersChartData = {
        labels: dailyOrders.map((_, index) => `Day ${index + 1}`),
        datasets: [
            {
                label: 'Pending Orders',
                data: dailyOrders.map((day) => day.pending),
                backgroundColor: 'rgba(255, 165, 0, 0.6)',
                borderColor: 'rgba(255, 165, 0, 1)',
                borderWidth: 1,
            },
            {
                label: 'Canceled Orders',
                data: dailyOrders.map((day) => day.canceled),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
            {
                label: 'Delivered Orders',
                data: dailyOrders.map((day) => day.delivered),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                title: ''
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    
    
    
    return (
      
        <ChartRow>
            <ChartWrapper>
                <Bar 
                    data={revenueChartData} 
                    options={{
                        ...chartOptions,
                        plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Monthly Revenue' } }
                    }}
                />
            </ChartWrapper>

            <ChartWrapper>
                <Bar 
                    data={ordersChartData} 
                    options={{
                        ...chartOptions,
                        plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Monthly Orders' } }
                    }}
                />
            </ChartWrapper>
        </ChartRow>
       
    )
}

export default MonthlyRevenueChart