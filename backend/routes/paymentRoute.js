import express from 'express';
import { initiatePayment, handlePaymentCallback, getPaymentDetails, pollPaymentStatus } from '../services/paymentService.js';

const router = express.Router();


router.post('/start-payment', async (req, res) => {
    const { phoneNumber, amount, orderId } = req.body;
    
    try {
        const paymentResponse = await initiatePayment(phoneNumber, amount, orderId);
        res.json(paymentResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/callback', async (req, res) => {
    const { orderId } = req.body;
    console.log('Callback recived', req.body);

    if (!orderId) {
        console.error('Missing orderId:', req.body);
        return res.status(400).json({ error: 'Missing orderId' });
    }

    try {
        const paymentDetails = await getPaymentDetails(orderId);

        console.log('(Post Callback) Payment details received from Vipps:', paymentDetails)

        const callbackResult = await handlePaymentCallback(orderId, paymentDetails);
        res.status(200).json({ message: 'Callback processed', status: callbackResult.status });
    } catch (error) {
        console.error('Error processing callback:', error);
        res.status(500).json({ message: 'Callback failed'})
    }
});


router.post('/remove-consent', async (req, res) => {
    const removalData = req.body;

    console.log('Consent removed:', removalData);

    res.status(200).send('Consent removal handled');
});


router.get("/poll-status/:orderId", async (req, res) => {
    const {orderId} = req.params;

    try {
        const paymentState = await pollPaymentStatus(orderId);
        
        res.status(200).json(paymentState)
    } catch (error) {
        console.error("Error polling payment status:", error);
        res.status(500).json({ status: 'error', message: 'Failed to poll payment status' });
    }
})

export default router;
