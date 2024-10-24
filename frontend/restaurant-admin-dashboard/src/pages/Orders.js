import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OrderTable from "../components/Orders/OrderTable";
import {fetchOrders} from "../redux/slices/orderSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <p>loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <OrderTable orders={orders}/>
    </div>
  )
}

export default Orders