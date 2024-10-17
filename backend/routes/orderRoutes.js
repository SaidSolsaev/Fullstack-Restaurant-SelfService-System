import express from 'express';
import { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder, getOrderByOrderNumber } from '../controllers/orderController.js';
import { authMiddleware, verifyDeviceKey } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/orders", authMiddleware ,getAllOrders);

router.get("/orders/:id", getOrderById);

router.get('/orders/orderNumber/:orderNumber', getOrderByOrderNumber);

router.post('/orders', verifyDeviceKey, createOrder);

router.put('/orders/:id', updateOrder);

router.delete('/orders/:id', deleteOrder);

export default router;
