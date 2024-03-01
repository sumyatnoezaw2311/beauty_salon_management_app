import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, HEADERS, getInfoFromLocal } from "../utils/config";
import axios from "axios";
import { ShowToast } from "../components/utils/ShowToast";

const initialState = {
    expenses: null,
    loading: false,
    data: null,
    error: null
}

export const getAllExpense = createAsyncThunk(
    'expense/getAllExpense',
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
                url: `${BASE_URL}/expenses?shopId=${shop_id}${pageNo ? `&page=${pageNo}`: ""}${(startDate && endDate) ? `&startDate=${startDate}&endDate=${endDate}`: "" }${keyword ? `&description=${keyword}` : ""}`,
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

export const expenseCrud = createAsyncThunk(
    'expense/expenseCrud',
    async ({ method,data,id }) => {
        const shop_id = getInfoFromLocal().user.shopId
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/expenses${id ? `/${id}` : ''}?shopId=${shop_id}`,
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
            ShowToast('warning', "Something went wrong")
            throw new Error(error);
        }
    }
);

const expenseSlice = createSlice({
    name: "expense",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(expenseCrud.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(expenseCrud.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(expenseCrud.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(getAllExpense.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllExpense.fulfilled, (state, action) => {
            state.loading = false;
            state.expenses = action.payload;
        })
        .addCase(getAllExpense.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export default expenseSlice.reducer;