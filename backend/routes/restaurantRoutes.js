import { getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant, getRestaurantById, getAdminRestaurant } from '../controllers/restaurantController.js';
import express from "express"
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/restaurants", getRestaurants);

router.get("/restaurants/:id", getRestaurantById);

router.get("/restaurants-me", authMiddleware, getAdminRestaurant);

router.post('/restaurants', createRestaurant);

router.put('/restaurants/:id', authMiddleware, updateRestaurant);

router.delete('/restaurants/:id', authMiddleware, deleteRestaurant);

export default router;