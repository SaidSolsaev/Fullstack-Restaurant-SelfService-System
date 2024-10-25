import React, { useState } from 'react'
import styled from 'styled-components';
import { FaEye } from "react-icons/fa";

const TableWrapper = styled.div`
    margin: 20px 0;
    padding: 20px;
    background-color: ${({ theme }) => theme.cardBackground};
    border-radius: 10px;
    box-shadow: ${({ theme }) => theme.boxShadow};
    overflow-x: auto;
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

    const displayedOrders = showAll ? orders : orders.slice(0, 5);

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
                        .slice()
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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