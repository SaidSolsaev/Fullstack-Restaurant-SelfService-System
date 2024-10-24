import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../redux/slices/orderSlice'
import styled from 'styled-components';
import { FaMoneyBillAlt } from "react-icons/fa";
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FaListAlt, FaDollarSign, FaTruck } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { AiOutlineClockCircle } from 'react-icons/ai';



const InfoContainer = styled.div`
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 20px;
`;


const InfoCard = styled.div`
    background-color: ${({ $bgColor }) => $bgColor || '#FFF'};
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 220px;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-5px);
    }

    h2 {
        font-size: 1.1rem;
        color: #333;
        margin-bottom: 10px;
    }

    p {
        font-size: 1.5rem;
        font-weight: bold;
        color: #111;
    }

    small {
        display: block;
        font-size: 0.9rem;
        color: #555;
    }

    @media (max-width: 768px) {
        padding: 15px;
        h2 {
            font-size: 1rem;
        }

        p {
            font-size: 1.2rem;
        }
    }

    @media (max-width: 480px) {
        padding: 10px;
        h2 {
            font-size: 0.9rem;
        }

        p {
            font-size: 1rem;
        }
    }
`;

const OverviewContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    padding: 20px;
    margin: 0 auto;
    width: 100%;
    

    @media (max-width: 768px) {
        padding: 10px;
        gap: 10px;
    }
`;

const Icon = styled.div`
    width: 30px;
    display: flex;
    height: 30px;
    align-items: center;
    justify-content: center;
`;

const IconWrapper = styled.div`
    background-color: ${({ $iconBgColor }) => $iconBgColor || '#FFF'};
    padding: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-bottom: 15px;
`;


const OrderSummary = () => {
    const dispatch = useDispatch();
    const {orders, todaysOrders, totalItemsOrderedToday, dailyRevenue, loading: ordersLoading, error: ordersError } = useSelector((state) => state.orders);

    const today = new Date().toISOString().split('T')[0];


    
    const todaysCanceledOrders = orders.filter(
        (order) => order.status === 'canceled' && order.createdAt.startsWith(today)
    ).length;

    const todaysPendingOrders = orders.filter(
        (order) => order.status === 'pending' && order.createdAt.startsWith(today)
    ).length;

    const todaysDeliveredOrders = orders.filter(
        (order) => (order.status === 'delivered'  && order.createdAt.startsWith(today)) 
        || (order.status === 'done' && order.createdAt.startsWith(today))
    ).length;

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    if (ordersLoading) return <p>Loading...</p>;
    if (ordersError) return <p>Error: {ordersError}</p>;

    return (
        <InfoContainer>
            <h1>Today's Sales</h1>
            <small>Sales Summary</small>

            <OverviewContainer>
                <InfoCard $bgColor="#fce8e8">
                    <IconWrapper $iconBgColor="#ff9999">
                        <Icon><AiOutlineShoppingCart /></Icon>
                    </IconWrapper>

                    <h2>Total Orders</h2>
                    <p>{todaysOrders}</p>
                    <small>+5% from yesterday</small>
                </InfoCard>

                <InfoCard $bgColor="#fff5d9">
                    <IconWrapper $iconBgColor="#ffcc80">
                        <Icon><FaListAlt /></Icon>

                    </IconWrapper>
                    <h2>Items Ordered</h2>
                    <p>{totalItemsOrderedToday}</p>
                    <small>+8% from yesterday</small>
                </InfoCard>

                <InfoCard $bgColor="#e8f5e9">
                    <IconWrapper $iconBgColor="#81c784">
                        <Icon><FaDollarSign /></Icon>
                    </IconWrapper>

                    <h2>Today's Revenue</h2>
                    <p>${dailyRevenue.toFixed(2)}</p>
                    <small>+12% from yesterday</small>
                </InfoCard>

                <InfoCard $bgColor="#e0f7fa">
                    <IconWrapper $iconBgColor="#4dd0e1">
                        <Icon><MdCancel /></Icon>
                    </IconWrapper>

                    <h2>Canceled Orders</h2>
                    <p>{todaysCanceledOrders}</p>
                    <small>-2% from yesterday</small>
                </InfoCard>

                <InfoCard $bgColor="#f3e5f5">
                    <IconWrapper $iconBgColor="#ba68c8">
                        <Icon><AiOutlineClockCircle /></Icon>
                    </IconWrapper>

                    <h2>Pending Orders</h2>
                    <p>{todaysPendingOrders}</p>
                    <small>+1% from yesterday</small>
                </InfoCard>

                <InfoCard $bgColor="#e1f5fe">
                    <IconWrapper $iconBgColor="#29b6f6">
                        <Icon><FaTruck /></Icon>
                    </IconWrapper>

                    <h2>Delivered Orders</h2>
                    <p>{todaysDeliveredOrders}</p>
                    <small>+4% from yesterday</small>
                </InfoCard>
            </OverviewContainer>

        </InfoContainer>
    );
}

export default OrderSummary;