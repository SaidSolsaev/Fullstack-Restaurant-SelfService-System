import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";


export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
    const response = await api.get(`/api/orders`);
    return response.data;
})

export const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        totalOrders: 0,
        todaysOrders: 0,
        dailyRevenue: 0,
        canceledOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        totalItemsOrderedToday: 0,
        monthlyRevenue: {},
    },
    reducers: {
        setDailyRevenue: (state, action) => {
            state.dailyRevenue = action.payload;
        },
        setTotalOrders: (state, action) => {
            state.totalOrders = action.payload;
        },
        setTodaysOrders: (state, action) => {
            state.todaysOrders = action.payload;
        },
        setCanceledOrders: (state, action) => {
            state.canceledOrders = action.payload;
        },
        setPendingOrders: (state, action) => {
            state.pendingOrders = action.payload;
        },
        setDeliveredOrders: (state, action) => {
            state.deliveredOrders = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;

                const today = new Date().toISOString().split('T')[0];
                let totalItemsOrderedToday = 0;
                let totalOrders = 0;
                let dailyRevenue = 0;
                let canceledOrders = 0;
                let pendingOrders = 0;
                let deliveredOrders = 0;
                let todaysOrders = 0;


                action.payload.forEach((order) => {
                    totalOrders += 1;

                    if (order.createdAt.startsWith(today)) {
                        todaysOrders += 1;
                    }

                    if (order.status === 'delivered' || order.status === 'done'){
                        deliveredOrders += 1;
                        if (order.createdAt.startsWith(today)){
                            dailyRevenue += parseFloat(order.totalAmount);
                            
                            order.orderItem.forEach((item) => {
                                totalItemsOrderedToday += item.quantity;
                            });
                        }
                    } else if (order.status === 'pending'){
                        pendingOrders +=1;
                    } else if (order.status === 'canceled'){
                        canceledOrders +=1;
                    }
                })


                state.totalOrders = totalOrders;
                state.dailyRevenue = dailyRevenue;
                state.canceledOrders = canceledOrders;
                state.pendingOrders = pendingOrders;
                state.deliveredOrders = deliveredOrders;
                state.todaysOrders = todaysOrders;
                state.totalItemsOrderedToday = totalItemsOrderedToday;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }
});

export const { 
    setDailyRevenue,
    setTotalOrders,
    setCanceledOrders,
    setApprovedOrders,
    setDeliveredOrders
} = ordersSlice.actions;

export default ordersSlice.reducer;