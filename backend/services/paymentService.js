import axios from "axios";
import express from "express";

const CLIENT_ID = process.env.VIPPS_CLIENT_ID;
const CLIENT_SECRET = process.env.VIPPS_CLIENT_SECRET;
const SUBSCRIPTION_KEY = process.env.VIPPS_SUBSCRIPTION_KEY;
const BASE_URL = 'https://apitest.vipps.no';

// VIPPS
const getAccessToken = async () => {
    const combinedString = `${CLIENT_ID}:${CLIENT_SECRET}`;
    const authData = Buffer.from(combinedString, 'utf-8').toString('base64');
    
    try {
        const response = await axios.post(
            `${BASE_URL}/accesstoken/get`,
            {},
            {
                headers: {
                    'Authorization': `Basic ${authData}`,
                    "Ocp-Apim-Subscription-Key": `${SUBSCRIPTION_KEY}`,
                    "client_secret": `${CLIENT_SECRET}`,
                    "client_id": `${CLIENT_ID}`,
                    "Merchant-Serial-Number": "344925",
                    'Content-Type': 'application/json',
                },
            }
        );
        
      return response.data.access_token;
    } catch (error) {
        console.error('Failed to get access token', error);
        throw new Error('Could not authenticate with Vipps', combinedString);
    }
};

export const initiatePayment = async(phoneNumber, amount) => {
    const accessToken = await getAccessToken();

    const paymentData = {
        customerInfo: {
            mobileNumber: phoneNumber,
        },
        merchantInfo: {
            merchantSerialNumber: '344925',
            callbackPrefix: `https://${process.env.NGROK_URL}/api/payment/callback`,
            fallBack: `myapp://payment-success`,
            consentRemovalPrefix: `https://${process.env.NGROK_URL}/api/payment/remove-consent`,
            paymentType: 'eComm Regular Payment',
        },
        transaction: {
            amount: amount * 100,
            transactionText: 'Order payment for your purchase',
            orderId: `order-${Date.now()}`,
        },
    };

    try {
        const response = await axios.post(
            `${BASE_URL}/ecomm/v2/payments`,
            paymentData,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
                    'Content-Type': 'application/json',
                    'Vipps-System-Name': 'Burger Place',
                    'Vipps-System-Version': '1.0',
                },
            }
        );
        
        return response.data;
    } catch (error) {
        // console.error('Failed to initiate payment', error);
        throw new Error('Payment initiation failed');
    }
}

export const handlePaymentCallback = async (orderId, paymentDetails) => {
    // Handle the callback from Vipps (e.g., update order status in database)
    console.log(`Payment callback received for order: ${orderId}`, paymentDetails);
};
