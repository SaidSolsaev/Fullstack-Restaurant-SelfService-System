import express from 'express';
import { createAdmin, loginAdmin, logoutAdmin, updateAdmin, deleteAdmin } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();


router.post('/register', createAdmin);
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);


router.put('/admins/:id', authMiddleware, updateAdmin);

router.delete('/admins/:id', authMiddleware, deleteAdmin);


export default router;