import express from 'express';
import { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder } from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/orders", getAllOrders);

router.get("/orders/:id", getOrderById);

router.post('/orders', createOrder);

router.put('/orders/:id', updateOrder);

router.delete('/orders/:id', deleteOrder);

export default router;
