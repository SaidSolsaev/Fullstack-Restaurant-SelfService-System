import express from 'express';
import { createMenu, deleteMenu, getMenu, getMenuById } from '../controllers/menuController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get("/menu", getMenu);

router.get("/menu/:id", getMenuById);

router.post('/menu', authMiddleware, createMenu);

router.delete('/menus/:id', authMiddleware, deleteMenu);

export default router;