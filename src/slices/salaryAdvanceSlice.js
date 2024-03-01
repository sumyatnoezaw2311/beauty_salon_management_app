import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, HEADERS, getInfoFromLocal, shopId } from "../utils/config";
import axios from "axios";
import { ShowToast } from "../components/utils/ShowToast";

const initialState = {
    advances: null,
    loading: false,
    data: null,
    error: null
}

export const getAllAdvance = createAsyncThunk(
    'salaryAdvance/getAllAdvance',
    async ({ method,data }) => {
        const shop_id = getInfoFromLocal().user.shopId
        const searchParams = new URLSearchParams(window.location.search);
        const pageNo = searchParams.get('page');
        const startDate = searchParams.get('start_date')    
        const endDate = searchParams.get('end_date')
        const keyword = searchParams.get('keyword')
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/salary-advances?shopId=${shop_id}${pageNo ? `&page=${pageNo}` : ""}${startDate && endDate ? `&startDate=${startDate}&endDate=${endDate}` : ""}${keyword ? `&employeeName=${keyword}`: ""}`,
                headers: HEADERS(),
                data: data
            };
            const response = await axios(config);
            return response.data;
        } catch (error){
            if(error.code === "ERR_NETWORK"){
                ShowToast('error', error.message)
            }else{
                ShowToast('error', "Something went wrong")
            }
            throw new Error(error);
        }
    }
);

export const advanceCud = createAsyncThunk(
    'salaryAdvance/advanceCud',
    async ({ method,data,id }) => {
        const shop_id = getInfoFromLocal().user.shopId
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/salary-advances${id ? `/${id}` : ''}?shopId=${shop_id}`,
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
        } catch (error){
            ShowToast('error', 'Something went wrong')
            throw new Error(error);
        }
    }
);

const salaryAdvanceSlice = createSlice({
    name: "salaryAdvance",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllAdvance.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllAdvance.fulfilled, (state, action) => {
            state.loading = false;
            state.advances = action.payload;
        })
        .addCase(getAllAdvance.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(advanceCud.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(advanceCud.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(advanceCud.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export default salaryAdvanceSlice.reducer;