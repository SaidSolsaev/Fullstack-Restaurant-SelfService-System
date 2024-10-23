import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const restaurantId = localStorage.getItem('restaurantId');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (restaurantId) {
        config.headers['restaurant-id'] = restaurantId
    }

    return config
}, (error) => {
    return Promise.reject(error);
});

export default api;