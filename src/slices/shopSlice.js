import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, HEADERS } from "../utils/config";
import axios from "axios";
import { ShowToast } from "../components/utils/ShowToast";

const initialState = {
    shops: null,
    loading: false,
    data: null,
    error: null
}

export const getAllShops = createAsyncThunk(
    'shop/getAllShops',
    async ({ method,data }) => {
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/shops`,
                headers: HEADERS(),
                data: data
            };
            const response = await axios(config);
            return response.data;
        } catch (error) {
            if(error.code === "ERR_NETWORK"){
                ShowToast('error', error.message)
            }else if(error.response.status === 403){
                ShowToast('error', 'Access denied!')
            }else{
                ShowToast('error', 'Something went wrong!')
            }
            throw new Error(error);
        }
    }
);

export const shopCud = createAsyncThunk(
    'shop/shopCud',
    async ({ method,data,id }) => {
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/shops${id ? `/${id}` : ''}`,
                headers: HEADERS(),
                data: data
            };
            const response = await axios(config);
            if(method === 'post'){
                ShowToast('success', 'Successfully created')
            }else if(method === 'put'){
                ShowToast('success', 'Successfully updated')
            }else if(method === 'delete'){
                ShowToast('success', 'Successfully deleted')
            }
            return response.data;
        } catch (error) {
            if(error.response.status === 403){
                ShowToast('error', 'Access denied!')
            }else{
                ShowToast('error', 'Something went wrong!')
            }
            throw new Error(error);
        }
    }
);

const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllShops.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllShops.fulfilled, (state, action) => {
            state.loading = false;
            state.shops = action.payload;
        })
        .addCase(getAllShops.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(shopCud.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(shopCud.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(shopCud.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

// export const {  } = shopSlice.actions

export default shopSlice.reducer;