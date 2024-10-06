
export const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
}

export const generateOrderNumber = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < length; i++){
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
};