import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const OrdersListWrapper = styled.div`
    grid-column: span 2;
    padding: 20px;
    background-color: ${({ theme }) => theme.cardBackground};
    border-radius: 10px;
    box-shadow: ${({ theme }) => theme.boxShadow};
`;

const OrderItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid ${({ theme }) => theme.borderColor};

    &:last-child {
        border-bottom: none;
    }

    p {
        margin: 0;
        text-align: left;
        width: 33%;

        &:last-child {
            text-align: right;
        }
    }

    .status {
        font-weight: bold;
        color: ${({ $status, theme }) =>
            $status === 'delivered' ? theme.success :
            $status === 'pending' ? theme.warning :
            $status === 'canceled' ? theme.error :
            theme.text}
        ;
        text-align: center;
    }
`;

const FilterButtons = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 20px 0;

    .filter-button {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 5px 10px;
        font-size: 1rem;

        &:hover {
            text-decoration: underline;
        }

        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 8px;
        }

        &.delivered .status-dot {
            background-color: ${({ theme }) => theme.success};
        }

        &.pending .status-dot {
            background-color: ${({ theme }) => theme.warning};
        }

        &.canceled .status-dot {
            background-color: ${({ theme }) => theme.error};
        }
    }
`;

const Last10Orders = () => {
    const {orders} = useSelector((state) => state.orders);
    const [filter, setFilter] = useState(null);


    const last10Orders = useMemo(() => {
        const filteredOrders = filter
        ? orders.filter((order) => order.status === filter)
        : orders;
        return filteredOrders.slice(-10).reverse();
    }, [orders, filter]);

    return (
        <OrdersListWrapper>
            <h2>Last 10 Orders</h2>
            
            <FilterButtons>
                <div className="filter-button delivered" onClick={() => setFilter('delivered')}>
                    <span className="status-dot"></span>
                    <p>Delivered</p>
                </div>
                <div className="filter-button pending" onClick={() => setFilter('pending')}>
                    <span className="status-dot"></span>
                    <p>Pending</p>
                </div>
                <div className="filter-button canceled" onClick={() => setFilter('canceled')}>
                    <span className="status-dot"></span>
                    <p>Canceled</p>
                </div>
                <div className="filter-button reset" onClick={() => setFilter(null)}>
                    <p>Reset</p>
                </div>
            </FilterButtons>

            {last10Orders.length > 0 ? (
                last10Orders.map((order) => (
                    <OrderItem key={order.id} $status={order.status}>
                        <p>Order #{order.orderNumber}</p>
                        <p className='status'>{order.status}</p>
                        <p>{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</p>
                    </OrderItem>
                ))
            ): (
                <p>No orders available</p>
            )}
        </OrdersListWrapper>
    ) 
}

export default Last10Orders