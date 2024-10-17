import express from 'express';
import { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder, getOrderByOrderNumber } from '../controllers/orderController.js';
import { authMiddleware, authenticateDevice, checkEitherAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/orders", checkEitherAuth, getAllOrders);

router.get("/orders/:id", authMiddleware, getOrderById);

router.get('/orders/orderNumber/:orderNumber',authMiddleware, getOrderByOrderNumber);

router.post('/orders', authenticateDevice, createOrder);

router.put('/orders/:id', authMiddleware, updateOrder);

router.delete('/orders/:id', authMiddleware, deleteOrder);

export default router;
