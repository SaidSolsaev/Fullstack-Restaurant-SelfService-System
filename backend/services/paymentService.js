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

export const initiatePayment = async(phoneNumber, amount, fallbackUrl, orderId) => {
    const accessToken = await getAccessToken();

    const paymentData = {
        customerInfo: {
            mobileNumber: phoneNumber,
        },
        merchantInfo: {
            merchantSerialNumber: '344925',
            callbackPrefix: `https://${process.env.NGROK_URL}/api/payment/callback`,
            fallBack: fallbackUrl,
            consentRemovalPrefix: `https://${process.env.NGROK_URL}/api/payment/remove-consent`,
            paymentType: 'eComm Regular Payment',
        },
        transaction: {
            amount: amount * 100,
            transactionText: 'Order payment for your purchase',
            orderId: orderId,
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

        
        return {
            url: response.data.url,
            orderId: orderId
        };
    } catch (error) {
        // console.error('Failed to initiate payment', error);
        throw new Error('Payment initiation failed');
    }
}

export const handlePaymentCallback = async (orderId, paymentDetails) => {

    const latestTransaction = paymentDetails.transactionLogHistory[0];

    if (!latestTransaction) {
        console.error(`No transaction log found for order: ${orderId}`);
        return { status: 'unknown' };
    }

    const paymentStatus = latestTransaction.operation;

    if (paymentStatus === 'CANCEL') {
        return { status: 'cancelled' };
    } else if (paymentStatus === 'VOID') {
        return { status: 'void' };
    } else if (paymentStatus === 'SALE') {
        return { status: 'completed' };
    } else if (paymentStatus === 'RESERVE') {
        return { status: 'reserved' };
    } else if(paymentStatus === 'INITIATE'){
        return {status: 'starting'}
    } else {
        return {status: paymentStatus}
    }
};

export const getPaymentDetails = async (orderId) => {
    const accessToken = await getAccessToken();

    try {
        const response = await axios.get(
            `${BASE_URL}/ecomm/v2/payments/${orderId}/details`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Failed to retrieve payment details from Vipps', error);
        throw new Error('Could not retrieve payment details from Vipps');
    }
};
