import express from 'express';
import { createMenuItem, getAllMenuItems, deleteMenuItem, updateMenuItem, getMenuItemById } from '../controllers/menuItemController.js';
import { authenticateDevice, authMiddleware, checkEitherAuth } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/menu-items', checkEitherAuth, getAllMenuItems);

router.get("/menu-items/:id", checkEitherAuth, getMenuItemById);

router.post('/menu-items', authMiddleware,  upload.single('image'), createMenuItem);

router.put('/menu-items/:id', authMiddleware, upload.single('image'), updateMenuItem);

router.delete('/menu-items/:id', authMiddleware, deleteMenuItem);


export default router;