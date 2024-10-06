import express from 'express';
import { createCategory, updateCategory, deleteCategory, getAllCategories, getCategoryById } from '../controllers/categoryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/categories", getAllCategories);

router.get("/categories", getCategoryById);

router.post('/categories', authMiddleware, createCategory);

router.put('/categories/:id', authMiddleware, updateCategory);

router.delete('/categories/:id', authMiddleware, deleteCategory);
export default router;