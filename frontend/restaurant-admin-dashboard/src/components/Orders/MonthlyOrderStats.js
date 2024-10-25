import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Doughnut  } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OrdersOverviewWrapper = styled.div`
    background-color: ${({ theme }) => theme.cardBackground};
    padding: 20px;
    border-radius: 10px;
    box-shadow: ${({ theme }) => theme.boxShadow};
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 450px;
    height: 400px;

    .statsContainer {
        width: 100%;
        max-height: 50%;
        margin-bottom: 5px;
    }

    @media (max-width: 1024px) {
        width: 100%;
        // height: auto;
    }

    @media (max-width: 768px) {
        padding: 15px;
        width: 100%;
    }

    @media (max-width: 480px) {
        padding: 10px;
        width: 100%;
        height: auto;
    }
`;

const Header = styled.h3`
    font-size: 1.5rem;
    margin-bottom: 20px;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 1.3rem;
    }

    @media (max-width: 480px) {
        font-size: 1.1rem;
    }
`;

const MonthSelector = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;

    button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        font-size: 1.5rem;
        color: ${({ theme }) => theme.textHover};
        
        &:disabled {
            color: ${({ theme }) => theme.secondaryText};
            cursor: not-allowed;
        }
        
        svg {
            display: flex;
            align-items: center;
        }
    }

    p {
        margin: 0 15px;
        font-size: 1.2rem;
    }
`;

const StatsWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin-top: 30px;

    @media (min-width: 768px) {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        gap: 40px;
    }

    @media (max-width: 480px) {
        gap: 10px;
    }
`;

const StatCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;

    p {
        font-size: 1rem;
        margin: 5px 0;
    }

    strong {
        font-size: 1.2rem;
        color: ${({ $status, theme }) =>
            $status === 'delivered' ? theme.success :
            $status === 'pending' ? theme.warning :
            $status === 'canceled' ? theme.error :
            $status === 'received' ? '#3498db' :
            theme.text}
        ;

        @media (max-width: 768px) {
            font-size: 1rem;
        }

        @media (max-width: 480px) {
            font-size: 0.9rem;
        }
    }
`;

const ChartWrapper = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    height: 50%;

    @media (max-width: 1024px) {
        width: 100%;
        // height: auto;
    }

    @media (max-width: 768px) {
        height: 300px;
    }

    @media (max-width: 480px) {
        height: 250px;
    }
`;

const MonthlyOrderStats = ({orders}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const currentYear = new Date().getFullYear();

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const orderDate = new Date(order.createdAt);

            return (
                orderDate.getMonth() === currentMonth &&
                orderDate.getFullYear() === currentYear
            );
        });
    }, [orders, currentMonth, currentYear]);


    const statusCounts = useMemo(() => {
        let counts = {canceled : 0, delivered: 0, pending: 0, received: 0};
        filteredOrders.forEach(order => {
            counts[order.status] = (counts[order.status] || 0) + 1;
        });

        return counts;
    }, [filteredOrders]);

    const chartData = {
        labels: ['Canceled', 'Delivered', 'Pending', 'Received'],
        datasets: [
            {
                data: [statusCounts.canceled, statusCounts.delivered, statusCounts.pending, statusCounts.received],
                backgroundColor: ['#e74c3c', '#2ecc71', '#f39c12', '#3498db'],
                hoverBackgroundColor: ['#c0392b', '#27ae60', '#e67e22', '#2980b9'],
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        const label = chartData.labels[tooltipItem.dataIndex];
                        const value = chartData.datasets[0].data[tooltipItem.dataIndex];
                        return `${label}: ${value} orders`;
                    }
                }
            },
        },
    };

    const previousMonth = () => setCurrentMonth(currentMonth - 1);
    const nextMonth = () => setCurrentMonth(currentMonth + 1);

    
    return (
        <OrdersOverviewWrapper>
            <div className='statsContainer'>
                <Header>Total Placed Orders</Header>
        
                <MonthSelector>
                    <button onClick={previousMonth} disabled={currentMonth === 0}>
                    <FaArrowLeft />
                    </button>
                    <p>{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })}</p>
                    <button onClick={nextMonth} disabled={currentMonth === new Date().getMonth()}>
                    <FaArrowRight />
                    </button>
                </MonthSelector>
        
                <StatsWrapper>
                    <StatCard $status="delivered">
                        <strong>{statusCounts.delivered}</strong>
                        <p>Delivered</p>
                    </StatCard>

                    <StatCard $status="canceled">
                        <strong>{statusCounts.canceled}</strong>
                        <p>Canceled</p>
                    </StatCard>
                    
                    <StatCard $status="pending">
                        <strong>{statusCounts.pending}</strong>
                        <p>Pending</p>
                    </StatCard>
                    
                    <StatCard $status="received">
                        <strong>{statusCounts.received}</strong>
                        <p>Received</p>
                    </StatCard>
                </StatsWrapper>
            </div>
    
            <ChartWrapper>
                <Doughnut data={chartData} options={options}/>
            </ChartWrapper>
      </OrdersOverviewWrapper>
    )
}

export default MonthlyOrderStats