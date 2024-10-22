import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './slices/ordersSlice';
import productsReducer from './slices/productsSlice';

export const store = configureStore({
    reducer: {
        orders: ordersReducer,
        prducts: productsReducer
    }
});