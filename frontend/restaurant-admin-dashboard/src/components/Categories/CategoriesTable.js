import React from 'react'
import styled from 'styled-components';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';


const TableWrapper = styled.div`
    width: 400px;
    overflow-x: auto;

    @media (max-width: 768px) {
        width: 100%;

        th:last-child, td:last-child {
            text-align: end;
        }
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
        font-weight: bold;
        color: ${({ theme }) => theme.secondaryText};
    }
    td {
        color: ${({ theme }) => theme.text};
    }
    tbody tr:hover {
        background-color: ${({ theme }) => theme.hoverBackground};
        cursor: pointer;
    }
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: ${({ theme, color }) => color};
    font-size: 1.2em;
    margin: 0 10px;
    &:hover {
        opacity: 0.8;
        background: none;
    }
`;

const CategoriesTable = ({categories, onEdit, onDelete}) => {
    
    return (
        <TableWrapper>
            <StyledTable>
                <thead>
                    <tr>
                        <th>Category Name</th>
                        <th>Items</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.id}>
                            <td>{category.name}</td>
                            <td>{category.MenuItems?.length}</td>
                            <td>
                                <ActionButton color="#4CAF50" onClick={() => onEdit(category)}>
                                    <FaEdit />
                                </ActionButton>
                                <ActionButton color="#e74c3c" onClick={() => onDelete(category.id)}>
                                    <FaTrashAlt />
                                </ActionButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </StyledTable>
    </TableWrapper>
    )
}

export default CategoriesTable