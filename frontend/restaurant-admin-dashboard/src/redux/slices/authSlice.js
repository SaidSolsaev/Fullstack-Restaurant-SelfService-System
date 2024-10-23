import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
    restaurantId: localStorage.getItem('restaurantId') ? localStorage.getItem('restaurantId') : null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.token = action.payload.token;
            state.restaurantId = action.payload.restaurantId;
            state.isAuthenticated = true;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
        }
    }
});

export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;