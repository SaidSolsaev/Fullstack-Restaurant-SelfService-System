import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../redux/slices/orderSlice'
import styled from 'styled-components';


const InfoCard = styled.div`
    background-color: ${({ theme }) => theme.cardBackground};
    padding: 20px;
    border-radius: 10px;
    box-shadow: ${({ theme }) => theme.boxShadow};
    width: 100%;
    max-width: 300px;
    text-align: center;

    @media (max-width: 768px) {
        max-width: 100%;
        padding: 15px;
    }

    @media (max-width: 480px) {
        padding: 10px;
    }
`;

const OverviewContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-around;
    padding: 20px;
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
        <OverviewContainer>
            <InfoCard>
                <h2>Total Orders</h2>
                <p>{todaysOrders}</p>
            </InfoCard>

            <InfoCard>
                <h2>Items Ordered</h2>
                <p>{totalItemsOrderedToday}</p>
            </InfoCard>

            <InfoCard>
                <h2>Todays Revenue</h2>
                <p>${dailyRevenue.toFixed(2)}</p>
            </InfoCard>

            <InfoCard>
                <h2>Canceled Orders</h2>
                <p>{todaysCanceledOrders}</p>
            </InfoCard>

            <InfoCard>
                <h2>Pending Orders</h2>
                <p>{todaysPendingOrders}</p>
            </InfoCard>

            <InfoCard>
                <h2>Delivered Orders</h2>
                <p>{todaysDeliveredOrders}</p>
            </InfoCard>
        </OverviewContainer>
    );
}

export default OrderSummary;