import React, { useMemo } from 'react'
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styled from 'styled-components';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const ChartRow = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    align-items: center;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const ChartWrapper = styled.div`
    border-radius: 10px;

    canvas{
        width: 100%;
        height: 500px;
    }
`;

const MonthlyRevenueChart = () => {
    const {orders} = useSelector((state) => state.orders);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const dailyRevenue = useMemo(() => {
        const revenueByDay = Array(31).fill(0);
    

        orders.forEach((order) => {
            const orderDate = new Date(order.createdAt);
            const orderDay = orderDate.getDate() - 1;

            if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear){
                if (['delivered', 'done'].includes(order.status)){
                    revenueByDay[orderDay] += parseFloat(order.totalAmount);
                }

            }
        });

        return revenueByDay.slice(0, new Date(currentYear, currentMonth + 1, 0).getDate());
        
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

    

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Revenue',
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
                    options={chartOptions}
                />
            </ChartWrapper>

        </ChartRow>
       
    )
}

export default MonthlyRevenueChart