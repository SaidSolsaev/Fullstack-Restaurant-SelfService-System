import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",
    async () => {
        const response = await api.get(`/api/categories`);
        return response.data;
    }
);

export const addCategory = createAsyncThunk(
    "categories/addCategory",
    async ({name}) => {
        const response = await api.post("/api/categories", {name});
        return response.data;
    }
);

export const updateCategory = createAsyncThunk(
    "categories/updateCategory",
    async ({ id, name }) => {
        const response = await api.put(`/api/categories/${id}`, { name });
        return response.data;
    }
);
  
export const deleteCategory = createAsyncThunk(
    "categories/deleteCategory",
    async (id) => {
        await api.delete(`/api/categories/${id}`);
        return id;
    }
);


const categorySlice = createSlice({
    name: "categories",
    initialState: {
      items: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.items.findIndex((category) => category.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.items = state.items.filter((category) => category.id !== action.payload);
            });
    },
});
  
export default categorySlice.reducer;
