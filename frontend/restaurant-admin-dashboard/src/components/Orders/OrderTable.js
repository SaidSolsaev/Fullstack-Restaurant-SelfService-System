import React, { useState, useMemo } from 'react'
import styled from 'styled-components';
import { FaEye } from "react-icons/fa";

const TableWrapper = styled.div`
    padding: 20px;
    background-color: ${({ theme }) => theme.cardBackground};
    border-radius: 10px;
    box-shadow: ${({ theme }) => theme.boxShadow};
    overflow-x: auto;
    max-height: 400px;
    width: 100%;

    @media (max-width: 768px) {
        padding: 15px;
        margin: 15px 0;
    }

    @media (max-width: 480px) {
        padding: 10px;
        margin: 10px 0;
    }
`;


const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    
    th, td {
        padding: 15px;
        border-bottom: 1px solid ${({ theme }) => theme.borderColor};
    }

    th {
        color: ${({theme}) => theme.secondaryText};
    }

    td {
        color: ${({ theme }) => theme.text};
    }

    tbody {
       
        tr:hover {
            background-color: ${({ theme }) => theme.hoverBackground};
            cursor: pointer;
        }
    }

    @media (max-width: 768px) {
        th, td {
            padding: 10px;
            font-size: 0.9rem;
        }
    }

    @media (max-width: 480px) {
        th, td {
            padding: 8px;
            font-size: 0.8rem;
        }
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 30px;

    span {
        cursor: pointer;        
        font-weight: bold;

        &:hover {
            text-decoration: underline;
            color: ${({ theme }) => theme.primaryButtonHover};
        }
    }
`;


const OrderTable = ({orders}) => {
    const [showAll, setShowAll] = useState(false);

    const displayedOrders = useMemo(() => {
        const sortedOrders = orders.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return showAll ? sortedOrders : sortedOrders.slice(0, 5);
    }, [orders, showAll]);
    
    const toggleViewAll = () => setShowAll(!showAll);
    
    return (
        <TableWrapper>
            <StyledTable>
                <thead>
                    <tr>
                        <th>Order Number</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedOrders.length > 0 ? (
                        displayedOrders
                        .map((order) => (
                            <tr key={order.id}>
                                <td>{order.orderNumber}</td>
                                <td>{order.phoneNumber}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>{order.status}</td>
                                <td>${order.totalAmount}</td>
                                <td><FaEye /></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No orders found</td>
                        </tr>
                    )}
                </tbody>
            </StyledTable>
            
            {orders.length > 5 && (
                <ButtonWrapper>
                    <span onClick={toggleViewAll}>
                        {showAll ? 'Show Less' : 'View All'}
                    </span>
                </ButtonWrapper>
            )}
        </TableWrapper>
    );
}

export default OrderTable