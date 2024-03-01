import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, HEADERS, getInfoFromLocal, shopId } from "../utils/config";
import axios from "axios";
import { ShowToast } from "../components/utils/ShowToast";

const initialState = {
    dashboardData: null,
    loading: false,
    data: null,
    error: null
}

export const getDashboardData = createAsyncThunk(
    'dashboard/getDashboardData',
    async ({ method }) => {
        const shop_id = getInfoFromLocal().user.shopId
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/dashboard?shopId=${shop_id}`,
                headers: HEADERS(),
                data: null
            };
            const response = await axios(config);
            return response.data;
        } catch (error) {
            if(error.code === "ERR_NETWORK"){
                ShowToast('error', error.message)
            }else if(error.response.status === 400){
                ShowToast('warning', "Please select the shop")
            }else{
                ShowToast('warning', "Something went wrong")
            }
            throw new Error(error);
        }
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(getDashboardData.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getDashboardData.fulfilled, (state, action) => {
            state.loading = false;
            state.dashboardData = action.payload;
        })
        .addCase(getDashboardData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})


export default dashboardSlice.reducer;