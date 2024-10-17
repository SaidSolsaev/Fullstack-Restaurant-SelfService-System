import express from 'express';
import { createMenu, deleteMenu, getAllMenus, getMenuById } from '../controllers/menuController.js';
import { authenticateDevice, authMiddleware, checkEitherAuth } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get("/menu", checkEitherAuth, getAllMenus);

router.get("/menu/:id", checkEitherAuth, getMenuById);

router.post('/menu', authMiddleware, createMenu);

router.delete('/menus/:id', authMiddleware, deleteMenu);

export default router;