import express from 'express';
import { initiatePayment, handlePaymentCallback } from '../services/paymentService.js';

const router = express.Router();

// Payment initiation route
router.post('/start-payment', async (req, res) => {
    const { phoneNumber, amount } = req.body;
    
    try {
        const paymentResponse = await initiatePayment(phoneNumber, amount);
        res.json(paymentResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Payment callback route
router.post('/callback', async (req, res) => {
    const { orderId, paymentDetails } = req.body;
  
    try {
        await handlePaymentCallback(orderId, paymentDetails);
        res.status(200).send('Callback processed');
    } catch (error) {
        res.status(500).send('Callback failed');
    }
});

// Consent removal route
router.post('/remove-consent', async (req, res) => {
    const removalData = req.body; // Data from Vipps about consent removal

    console.log('Consent removed:', removalData);

    res.status(200).send('Consent removal handled');
});

export default router;
