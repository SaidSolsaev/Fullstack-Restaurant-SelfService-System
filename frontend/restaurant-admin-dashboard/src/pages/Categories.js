import React, {useEffect, useState} from 'react'
import styled from "styled-components";
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../redux/slices/categorySlice';
import {useDispatch, useSelector} from "react-redux";
import Searchbar from '../components/Common/Searchbar';
import CategoriesTable from '../components/Categories/CategoriesTable';
import Modal from '../components/Common/Modal';
import CategoryIncome from '../components/Categories/CategoryIncome';

const CategoriesContainer = styled.div`
  .space{
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      flex-direction: row;
    }
  }

  .header-content{
    border-bottom: 1px solid ${({ theme }) => theme.borderColor};
    padding: 15px 0;
  }

  .category-form {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    

    button {
      margin-top: 10px;
      padding: 8px;
      align-self: center;
    }
  }

`;


const Categories = () => {
  const dispatch = useDispatch();
  const {items: categories, loading, error} = useSelector((state) => state.categories);
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");


  const handleChange = (e) => {
    setNewCategoryName(e.target.value)
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    dispatch(addCategory({name: newCategoryName}));
    setNewCategoryName("");
    toggleModal();
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  }

  const handleEditSave = (e) => {
    e.preventDefault();
    dispatch(updateCategory({name: newCategoryName, id: selectedCategory.id}));
    setIsEditModalOpen(false);
    setSelectedCategory(null);
    setNewCategoryName("");
  }

  const handleDelete = (id) => {
    dispatch(deleteCategory(id))
  }

  const handleSearch = (query) => {
    if (!query) {
      setFilteredCategories(categories);
    } 
    else {
      setFilteredCategories(
        categories.filter((cat) =>
          cat.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  if (error) return <p>Error: {error}</p>

  return (
    <CategoriesContainer>
      <div className='row space'>
        <div className='row'>
          <button onClick={toggleModal}>Add New</button>
        </div>
        <Searchbar onSearch={handleSearch}/>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='row'>
          <div className='card'>
            <CategoriesTable categories={filteredCategories} onEdit={openEditModal} onDelete={handleDelete}/>
          </div>
          <CategoryIncome categories={categories}/>

        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <h3 className='header-content'>Add new category</h3>
        
        <form className='category-form' onSubmit={handleAddCategory}>          
          <input 
            name="name"
            value={newCategoryName}
            onChange={handleChange}
            placeholder='Category Name...'
            required
          />

          <button type='submit'>Add Category</button>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h3 className='header-content'>Edit {selectedCategory?.name}</h3>
        
        <form className='category-form' onSubmit={handleEditSave}>          
          <input 
            name="name"
            value={newCategoryName}
            onChange={handleChange}
            placeholder={selectedCategory?.name}
            required
          />

          <button type='submit'>Save Changes</button>
        </form>
      </Modal>

    </CategoriesContainer>
  )
}

export default Categories