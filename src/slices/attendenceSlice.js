import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, HEADERS, getInfoFromLocal } from "../utils/config";
import axios from "axios";
import { ShowToast } from "../components/utils/ShowToast";

const initialState = {
    attendenceBonus: null,
    attRecs: null,
    attData: null,
    loading: false,
    data: null,
    error: null
}


export const getAttendenceBonus = createAsyncThunk(
    'attendence/getAttendenceBonus',
    async ({ method,data }) => {
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/attendance-bonuses`,
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

export const attReport = createAsyncThunk(
    'attendence/attReport',
    async ({ method,data }) => {
        const shop_id = getInfoFromLocal().user.shopId
        const searchParams = new URLSearchParams(window.location.search);
        const pageNo = searchParams.get('page');
        const searchKeyword = searchParams.get('keyword')
        const date = searchParams.get('date')
        try {
            const config = {
                method: method,
                url: method === 'delete' ? `${BASE_URL}/attendances/delete` : `${BASE_URL}/attendances${shop_id ? `?shopId=${shop_id}`: ""}${pageNo ? `&page=${pageNo}` : ""}${searchKeyword ? `&name=${searchKeyword}` : ""}${date ? `&date=${date}` : ""}`,
                headers: HEADERS(),
                data: data
            };
            const response = await axios(config);
            if(method === 'post'){
                ShowToast('success', 'Successfully uploaded')
            }else if(method === 'delete'){
                ShowToast('success', 'Successfully deleted')
            }
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

export const updateAttBonus = createAsyncThunk(
    'attendence/updateAttBonus',
    async ({ method,data,id }) => {
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/attendance-bonuses/${id}`,
                headers: HEADERS(),
                data: data
            };
            const response = await axios(config);
            ShowToast('success', 'Successfully updated!')
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

const attendenceSlice = createSlice({
    name: "attendence",
    initialState,
    reducers: {
        setAttRecs: (state,action)=>{
            state.attRecs = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAttendenceBonus.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAttendenceBonus.fulfilled, (state, action) => {
            state.loading = false;
            state.attendenceBonus = action.payload;
        })
        .addCase(getAttendenceBonus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(updateAttBonus.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateAttBonus.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(updateAttBonus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(attReport.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(attReport.fulfilled, (state, action) => {
            state.loading = false;
            if(action.meta.arg.method === 'get'){
                state.attData = action.payload;
            }else{
                state.data = action.payload;
            }
        })
        .addCase(attReport.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export const { setAttRecs } = attendenceSlice.actions

export default attendenceSlice.reducer;