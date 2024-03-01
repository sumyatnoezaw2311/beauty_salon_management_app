import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, HEADERS, getInfoFromLocal, shopId } from "../utils/config";
import axios from "axios";
import { ShowToast } from "../components/utils/ShowToast";

const initialState = {
    salaries: null,
    loading: false,
    data: null,
    error: null
}

export const getAllSalaries = createAsyncThunk(
    'salary/getAllSalaries',
    async ({ method,data }) => {
        const shop_id = getInfoFromLocal().user.shopId
        const searchParams = new URLSearchParams(window.location.search);
        const date = searchParams.get('date');
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/salaries?shopId=${shop_id}${date ? `&date=${date}` : ""}`,
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

export const salaryAdjust = createAsyncThunk(
    'salary/salaryAdjust',
    async ({ method,data }) => {
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/salaries/add-salary-adjustments`,
                headers: HEADERS(),
                data: data
            };
            const response = await axios(config);
            ShowToast('success', 'Successfully created')
            return response.data;
        } catch (error) {
            ShowToast('error', 'Something went wrong')
            throw new Error(error);
        }
    }
);

const salarySlice = createSlice({
    name: "salary",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getAllSalaries.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllSalaries.fulfilled, (state, action) => {
            state.loading = false;
            state.salaries = action.payload;
        })
        .addCase(getAllSalaries.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(salaryAdjust.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(salaryAdjust.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(salaryAdjust.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})


export default salarySlice.reducer;