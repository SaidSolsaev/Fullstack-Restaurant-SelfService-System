import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    restaurantData: null,
    loading: false,
    error: null
};

const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        restaurantDataRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        restaurantDataSuccess: (state, action) => {
            state.loading = false;
            state.restaurantData = action.payload;
        },
        restaurantDataFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearRestaurantData: (state) => {
            state.restaurantData = null;
            state.loading = false;
            state.error = null;
        }
    }
});

export const { 
    restaurantDataRequest, 
    restaurantDataSuccess, 
    restaurantDataFailure, 
    clearRestaurantData 
} = restaurantSlice.actions;
  

export default restaurantSlice.reducer;