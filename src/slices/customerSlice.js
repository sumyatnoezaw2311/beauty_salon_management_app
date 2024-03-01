import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, HEADERS } from "../utils/config";
import axios from "axios";
import { ShowToast } from "../components/utils/ShowToast";

const initialState = {
    customers: null,
    loading: false,
    data: null,
    error: null
}

export const getAllCus = createAsyncThunk(
    'customer/getAllCus',
    async ({ method,data,keyword }) => {
        const searchParams = new URLSearchParams(window.location.search);
        const pageNo = searchParams.get('page');
        const searchKeyword = searchParams.get('keyword')
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/customers?name=${keyword}${pageNo ? `&page=${pageNo}` : ""}${searchKeyword ? `&name=${searchKeyword}` : ""}`,
                headers: HEADERS(),
                data: data
            };
            const response = await axios(config);
            return response.data;
        } catch (error) {
            if(error.code === "ERR_NETWORK"){
                ShowToast('error', error.message)
            }else{
                ShowToast('error', "Something went wrong")
            }
            throw new Error(error);
        }
    }
);

export const customerCud = createAsyncThunk(
    'customer/customerCud',
    async ({ method,data,id }) => {
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/customers${id ? `/${id}` : ''}`,
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

const authSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllCus.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllCus.fulfilled, (state, action) => {
            state.loading = false;
            state.customers = action.payload;
        })
        .addCase(getAllCus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(customerCud.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(customerCud.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(customerCud.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})


export default authSlice.reducer;