import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, HEADERS, getInfoFromLocal } from "../utils/config";
import axios from "axios";
import { ShowToast } from "../components/utils/ShowToast";

const initialState = {
    reports: null,
    loading: false,
    data: null,
    error: null
}

export const getReport = createAsyncThunk(
    'report/getReport',
    async ({ method,data }) => {
        const shop_id = getInfoFromLocal().user.shopId
        const searchParams = new URLSearchParams(window.location.search);
        const pageNo = searchParams.get('page');
        const startDate = searchParams.get('start_date')    
        const endDate = searchParams.get('end_date')
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/reports?shopId=${shop_id}${pageNo ? `&page=${pageNo}`: ""}${startDate && endDate ? `&startDate=${startDate}&endDate=${endDate}` : ""}`,
                headers: HEADERS(),
                data: data
            };
            const response = await axios(config);
            return response.data;
        } catch (error) {
            if(error.code === "ERR_NETWORK"){
                ShowToast('error', error.message)
            }else if(error.response.status === 403){
                ShowToast('error', 'Access denied')
            }else{
                ShowToast('error', 'Something went wrong')
            }
            throw new Error(error);
        }
    }
);

const reportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(getReport.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getReport.fulfilled, (state, action) => {
            state.loading = false;
            state.reports = action.payload;
        })
        .addCase(getReport.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})


export default reportSlice.reducer;