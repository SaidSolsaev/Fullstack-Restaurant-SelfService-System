import Constants from "expo-constants";


export const initiateVippsPayment = async (phoneNumber, totalPrice, orderId) => {
    
    const response = await fetch(`${Constants.expoConfig?.extra?.NGROK_URL}/api/payment/start-payment`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
            phoneNumber: phoneNumber,
            amount: totalPrice,
            orderId: orderId
        })
    });

    if (!response.ok) {
        throw new Error('Failed to initiate payment.');
    }

    return response.json();
}

export const pollPaymentStatus = async (orderId) => {
    const response = await fetch(`${Constants.expoConfig?.extra?.NGROK_URL}/api/payment/poll-status/${orderId}`);
    
    return await response.json();
};