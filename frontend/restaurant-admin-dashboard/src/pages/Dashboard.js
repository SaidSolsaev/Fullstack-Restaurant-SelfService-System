import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRestaurantData } from '../redux/actions/restaurantActions';
import styled from 'styled-components';
import OrderSummary from '../components/Dashboard/OrderSummary';
import MonthlyRevenueChart from '../components/Dashboard/MonthlyRevenueChart';
import TopSellingProducts from '../components/Dashboard/ProductList';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { restaurantData, loading: restaurantLoading, error: restaurantError } = useSelector((state) => state.restaurant);

    useEffect(() => {
        dispatch(fetchRestaurantData());
        
    }, [dispatch]);


    if (restaurantLoading) return <p>Loading...</p>;
    if (restaurantError) return <p>Error: {restaurantError}</p>;
    


    return (
        <div>
            <h1>Dashboard for {restaurantData?.name}</h1>

            <OrderSummary />
            
            <MonthlyRevenueChart />

            <TopSellingProducts />
        </div>
    )
}

export default Dashboard


