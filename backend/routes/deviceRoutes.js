import express from 'express';
import { createDevice, getDeviceById, updateDevice, deleteDevice, refreshToken, getAllDevices, deviceLogin } from '../controllers/deviceController.js';
import { authenticateDevice, authMiddleware, checkEitherAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new device
router.post('/devices', createDevice);

// Get all devices
router.get('/devices', authMiddleware, getAllDevices);

// Get a specific device by ID
router.get('/devices/:id', checkEitherAuth, getDeviceById);

// Update a device by ID
router.put('/devices/:id', updateDevice);

router.post('/devices/login', deviceLogin);

router.post('/devices/refresh-token', authenticateDevice, refreshToken);

// Delete a device by ID
router.delete('/devices/:id', deleteDevice);

export default router;
