import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './slices/orderSlice';
import productsReducer from './slices/productSlice';
import authReducer from "./slices/authSlice";
import restaurantReducer from "./slices/restaurantSlice"
import categoryReducer from "./slices/categorySlice";

export const store = configureStore({
    reducer: {
        orders: ordersReducer,
        products: productsReducer,
        auth: authReducer,
        restaurant: restaurantReducer,
        categories: categoryReducer
    }
});