import React, { useState } from 'react'
import styled from 'styled-components';

const TableWrapper = styled.div`
    margin: 20px 0;
    padding: 20px;
    background-color: ${({ theme }) => theme.cardBackground};
    border-radius: 10px;
    box-shadow: ${({ theme }) => theme.boxShadow};
    overflow-x: auto;
    // width: 50%;
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
        background-color: ${({ theme }) => theme.tableHeaderBackground};
        color: ${({ theme }) => theme.textLight};
    }

    td {
        color: ${({ theme }) => theme.text};
    }

    tr:hover {
        background-color: ${({ theme }) => theme.hoverBackground};
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 15px;

    button {
        padding: 10px 20px;
        background-color: ${({ theme }) => theme.primaryButton};
        color: ${({ theme }) => theme.buttonText};
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: ${({ theme }) => theme.primaryButtonHover};
        }

        @media (max-width: 768px) {
            width: 100%;
        }
    }
`;


const OrderTable = ({orders}) => {
    const [showAll, setShowAll] = useState(false);

    const displayedOrders = showAll ? orders : orders.slice(0, 5);

    const toggleViewAll = () => setShowAll(!showAll);

    console.log(showAll)
    
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
                                <td><button>View</button></td>
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
                    <button onClick={toggleViewAll}>
                        {showAll ? 'Show Less' : 'View All'}
                    </button>
                </ButtonWrapper>
            )}
        </TableWrapper>
    );
}

export default OrderTable