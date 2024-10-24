import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRestaurantData } from '../redux/actions/restaurantActions';
import styled from 'styled-components';
import OrderSummary from '../components/Dashboard/OrderSummary';
import MonthlyRevenueChart from '../components/Dashboard/MonthlyRevenueChart';
import TopSellingProducts from '../components/Dashboard/ProductList';
import MonthlyOrdersChart from '../components/Dashboard/MonthlyOrdersChart';
import Last10Orders from '../components/Dashboard/Last10Orders';
import OrderStats from '../components/Dashboard/OrderStats';

const DashboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const DashboardCard = styled.div`
    background-color: ${({ theme }) => theme.cardBackground};
    padding: 20px;
    border-radius: 10px;
    box-shadow: ${({ theme }) => theme.boxShadow};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const DashboardRow = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
`;

const DasboardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    width: 100%;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;


const Dashboard = () => {
    const dispatch = useDispatch();
    const { restaurantData, loading: restaurantLoading, error: restaurantError } = useSelector((state) => state.restaurant);

    useEffect(() => {
        dispatch(fetchRestaurantData());
        
    }, [dispatch]);


    if (restaurantLoading || !restaurantData) return <p>Loading...</p>;
    if (restaurantError) return <p>Error: {restaurantError}</p>;
    


    return (
        <DashboardContainer>
            <DashboardCard>
                <OrderSummary />
            </DashboardCard>

            <DashboardRow>
                <TopSellingProducts />
            </DashboardRow>

            
            <DasboardGrid>
                <DashboardCard>
                    <MonthlyRevenueChart />
                </DashboardCard>

                <DashboardCard>
                    <MonthlyOrdersChart />
                </DashboardCard>
            </DasboardGrid>

            <DasboardGrid>
                <Last10Orders />
            </DasboardGrid>

            <DashboardCard>
                <OrderStats />
            </DashboardCard>
           
        </DashboardContainer>
    )
}

export default Dashboard


