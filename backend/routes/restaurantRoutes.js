import { getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant, getRestaurantById, getAdminRestaurant } from '../controllers/restaurantController.js';
import express from "express"
import { authMiddleware, validateDevice } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/restaurants", validateDevice, getRestaurants);

router.get("/restaurants/:id", validateDevice, getRestaurantById);

router.get("/restaurants-me", authMiddleware, getAdminRestaurant);

//Remeber to change so only overall admin can create new restaurant
router.post('/restaurants', authMiddleware, createRestaurant);

router.put('/restaurants/:id', authMiddleware, updateRestaurant);

//Remeber to change so only overall admin can create new restaurant
router.delete('/restaurants/:id', authMiddleware, deleteRestaurant);

export default router;