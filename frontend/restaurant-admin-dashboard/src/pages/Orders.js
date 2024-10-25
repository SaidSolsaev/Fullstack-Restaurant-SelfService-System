import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OrderTable from "../components/Orders/OrderTable";
import {fetchOrders} from "../redux/slices/orderSlice";
import MonthlyOrderStats from '../components/Orders/MonthlyOrderStats';
import styled from 'styled-components';
import OrdersGraphs from '../components/Orders/OrdersGraphs';

const OrderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Row = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 1024px){
    flex-direction: column;
  }
`;

const OrderCard = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  padding: 20px;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <OrderContainer>
      <Row>
        <MonthlyOrderStats orders={orders}/>
        <OrderTable orders={orders}/>
      </Row>

        <OrderCard>
          <OrdersGraphs orders={orders}/>
        </OrderCard>
    </OrderContainer>
  )
}

export default Orders