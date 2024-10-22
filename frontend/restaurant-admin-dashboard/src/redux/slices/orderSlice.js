import { createSlice } from "@reduxjs/toolkit";

export const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        dailyOrders: [],
        totalOrders: 0,
        averageCookingTime: 0,
    },
    reducers: {
        setDailyOrders: (state, action) => {
            state.dailyOrders = action.payload;
        },
        setTotalOrders: (state, action) => {
            state.totalOrders = action.payload
        },
        setAverageCookingTime: (state, action) => {
            state.averageCookingTime = action.payload;
        }
    }
});

export const { setDailyOrders, setTotalOrders, setAverageCookingTime } = ordersSlice.actions;

export default ordersSlice.reducer;