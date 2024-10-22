import { createSlice } from '@reduxjs/toolkit';

export const productsSlice = createSlice({
    name: 'products',
    initialState: {
        productList: [],
        categories: [],
    },
    reducers: {
        addProduct: (state, action) => {
            state.productList.push(action.payload);
        },
        editProduct: (state, action) => {
            const index = state.productList.findIndex(p => p.id === action.payload.id);
            state.productList[index] = action.payload;
        },
        deleteProduct: (state, action) => {
            state.productList = state.productList.filter(p => p.id !== action.payload);
        },
    },
});

export const { addProduct, editProduct, deleteProduct } = productsSlice.actions;

export default productsSlice.reducer;
