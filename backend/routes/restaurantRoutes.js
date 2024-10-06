import { getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant, getRestaurantById } from '../controllers/restaurantController.js';
import express from "express"
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/restaurants", getRestaurants);

router.get("/restaurants/:id", getRestaurantById);

router.post('/restaurants', authMiddleware, createRestaurant);

router.put('/restaurants/:id', authMiddleware, updateRestaurant);

router.delete('/restaurants/:id', authMiddleware, deleteRestaurant);

export default router;