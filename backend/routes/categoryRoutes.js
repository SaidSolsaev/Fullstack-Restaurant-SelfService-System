import express from 'express';
import { createCategory, updateCategory, deleteCategory, getAllCategories, getCategoryById } from '../controllers/categoryController.js';
import { authMiddleware, authenticateDevice, checkEitherAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/categories",checkEitherAuth, getAllCategories);

router.get("/categories", checkEitherAuth, getCategoryById);

router.post('/categories', authMiddleware, createCategory);

router.put('/categories/:id', authMiddleware, updateCategory);

router.delete('/categories/:id', authMiddleware, deleteCategory);
export default router;