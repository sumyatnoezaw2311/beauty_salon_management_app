import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, HEADERS, getInfoFromLocal, shopId } from "../utils/config";
import axios from "axios";
import { ShowToast } from "../components/utils/ShowToast";

const initialState = {
    services: null,
    loading: false,
    data: null,
    error: null
}

export const getAllServices = createAsyncThunk(
    'service/getAllServices',
    async ({ method,data,keyword }) => {
        const shop_id = getInfoFromLocal().user.shopId
        const searchParams = new URLSearchParams(window.location.search);
        const pageNo = searchParams.get('page');    
        const searchKeyword = searchParams.get('keyword')
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/services?${keyword ? `name=${keyword}`: ""}&shopId=${shop_id}${pageNo ? `&page=${pageNo}`: ""}${searchKeyword ? `&name=${searchKeyword}` : ""}`,
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

export const serviceCud = createAsyncThunk(
    'service/serviceCud',
    async ({ method,data,id }) => {
        const shop_id = getInfoFromLocal().user.shopId
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/services${id ? `/${id}` : ''}?shopId=${shop_id}`,
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
            ShowToast('error', 'Something went wrong')
            throw new Error(error);
        }
    }
);


const serviceSlice = createSlice({
    name: "service",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllServices.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllServices.fulfilled, (state, action) => {
            state.loading = false;
            state.services = action.payload;
        })
        .addCase(getAllServices.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(serviceCud.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(serviceCud.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(serviceCud.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export default serviceSlice.reducer;