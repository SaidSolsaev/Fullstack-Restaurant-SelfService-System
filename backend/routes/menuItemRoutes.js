import express from 'express';
import { createMenuItem, getAllMenuItems, deleteMenuItem, updateMenuItem, getMenuItemById } from '../controllers/menuItemController.js';
import { authMiddleware, validateDevice, verifyDeviceKey } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/menu-items', validateDevice, getAllMenuItems);

router.get("/menu-items/:id", authMiddleware, getMenuItemById);

router.post('/menu-items', authMiddleware,  upload.single('image'), createMenuItem);

router.put('/menu-items/:id', authMiddleware, upload.single('image'), updateMenuItem);

router.delete('/menu-items/:id', authMiddleware, deleteMenuItem);


export default router;