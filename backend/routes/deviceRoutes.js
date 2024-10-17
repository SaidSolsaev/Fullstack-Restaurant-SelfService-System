import express from 'express';
import { createDevice, getDeviceById, updateDevice, deleteDevice, getAllDevices } from '../controllers/deviceController.js';

const router = express.Router();

// Create a new device
router.post('/devices', createDevice);

// Get all devices
router.get('/devices', getAllDevices);

// Get a specific device by ID
router.get('/devices/:id', getDeviceById);

// Update a device by ID
router.put('/devices/:id', updateDevice);

// Delete a device by ID
router.delete('/devices/:id', deleteDevice);

export default router;
