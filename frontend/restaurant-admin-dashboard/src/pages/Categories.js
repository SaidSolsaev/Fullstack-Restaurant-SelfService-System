import React, {useEffect, useState} from 'react'
import styled from "styled-components";
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../redux/slices/categorySlice';
import {useDispatch, useSelector} from "react-redux";

const PageWrapper = styled.div`
`;

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 20px;
`;

const CategoryCard = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  padding: 15px;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 300px;
`;

const Button = styled.button`
  background-color: ${({ theme, color }) => color || theme.primaryButton};
  color: ${({ theme }) => theme.primaryButtonText};
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme, $colorHover }) => $colorHover || theme.primaryButtonHover};
  }
`;



const Categories = () => {
  const dispatch = useDispatch();
  const {items: categories, loading, error} = useSelector((state) => state.categories);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = () => {
    if (newCategoryName.trim()){
      dispatch(addCategory({name: newCategoryName}));
      setNewCategoryName("");
    }
  };

  return (
    <div className=''>

      <div className='grid-container'>
        
        
      </div>
    </div>
  )
}

export default Categories