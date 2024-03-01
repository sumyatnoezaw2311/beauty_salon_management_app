import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, HEADERS } from "../utils/config";
import axios from "axios";
import { ShowToast } from "../components/utils/ShowToast";

const initialState = {
    users: null,
    user: null,
    loading: false,
    data: null,
    error: null
}

export const getAllUsers = createAsyncThunk(
    'user/getAllUsers',
    async ({ method,data }) => {
        const searchParams = new URLSearchParams(window.location.search);
        const pageNo = searchParams.get('page');
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/users${pageNo ? `?page=${pageNo}`: ""}`,
                headers: HEADERS(),
                data: data
            };
            const response = await axios(config);
            return response.data;
        } catch (error) {
            if(error.code === "ERR_NETWORK"){
                ShowToast('error', error.message)
            }else if(error.response.status === 403){
                ShowToast('error', 'Access Denied')
            }else{
                ShowToast('error', 'Something went wrong')
            }
            throw new Error(error);
        }
    }
);

export const userCrud = createAsyncThunk(
    'user/userCrud',
    async ({ method,data,id }) => {
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/users/${id}`,
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
                ShowToast('error', 'Access Denied')
            }else{
                ShowToast('error', 'Something went wrong')
            }
            throw new Error(error);
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
        })
        .addCase(getAllUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(userCrud.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(userCrud.fulfilled, (state, action) => {
            state.loading = false;
            if(action.meta.arg.method === "get"){
                state.user = action.payload;
            }else{
                state.data = action.payload
            }
        })
        .addCase(userCrud.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})


export default userSlice.reducer;