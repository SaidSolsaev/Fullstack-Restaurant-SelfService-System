import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styled from 'styled-components';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const ChartWrapper = styled.div`
    border-radius: 10px;
    width: 100%;
    height: 400px;
    padding: 10px;
`;

const MonthlyOrdersChart = () => {
    const { orders } = useSelector((state) => state.orders);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const dailyOrders = useMemo(() => {
        const ordersByDay = Array.from({ length: 31 }, () => ({
            pending: 0,
            canceled: 0,
            delivered: 0,
        }));

        orders.forEach((order) => {
            const orderDate = new Date(order.createdAt);
            const orderDay = orderDate.getDate() - 1;

            if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
                if (['delivered', 'done'].includes(order.status)) {
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

        return ordersByDay.slice(0, new Date(currentYear, currentMonth + 1, 0).getDate());
    }, [orders, currentMonth, currentYear]);

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
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Orders',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

   

    return (
        
        <ChartWrapper>
            <Bar
                data={ordersChartData} 
                options={chartOptions}
            />
        </ChartWrapper>
        
    );
};

export default MonthlyOrdersChart;
