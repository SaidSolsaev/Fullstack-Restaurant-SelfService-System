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

export const initiatePayment = async(phoneNumber, amount, orderId) => {
    const accessToken = await getAccessToken();

    const paymentData = {
        customer: {
            phoneNumber: phoneNumber.replace("+", ""),
        },
        reference: orderId,
        paymentMethod: {
            type: "WALLET"
        },
        amount: {
            currency: "NOK",
            value: amount * 100,
        },
        userFlow: "PUSH_MESSAGE",
    };

    const idempotencyKey = `order-${orderId}-${Date.now()}`;

    try {
        const response = await axios.post(
            `${BASE_URL}/epayment/v1/payments`,
            paymentData,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
                    'Idempotency-Key': idempotencyKey,
                    'Merchant-Serial-Number': '344925',
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
        console.error(error.response?.data)
        throw new Error('Payment initiation failed');
    }
}

export const pollPaymentStatus = async (orderId) => {
    let pollAtempts = 0;
    const accessToken = await getAccessToken();

    const poll = async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}/epayment/v1/payments/${orderId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
                        'Merchant-Serial-Number': '344925',
                        'Content-Type': 'application/json'
                    }
                }
            );

            const status = response.data.state;

            if (status === 'AUTHORIZED'){
                return {status: 'completed', orderId, message: "Payment Successful!"}
            } else if(status === 'ABORTED' || status === 'TERMINATED'){
                return {status: 'cancelled', orderId, message: "Payment Cancelled"}
            } else if (status === "EXPIRED"){
                return {status: "expired", orderId, message: "Payment expired"}
            } else if (status === 'CREATED'){
                if (pollAtempts < 5){
                    pollAtempts++;
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    return poll();
                } else {
                    return {status: "Timeout", orderId, message: "Payment Timed out. Please try again."}
                }
            } else{
                return {status: "unkown", orderId, message: "Error occured, Unkonwn status"}
            }
        } catch (error) {
            return {status: "error", orderId, message: "Error polling payment status"}
        }
    }

    return poll();
}

export const handlePaymentCallback = async (orderId, paymentDetails) => {
    console.log("inside handle payment callback")
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
