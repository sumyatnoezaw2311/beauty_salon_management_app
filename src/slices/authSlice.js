import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, HEADERS, authName, setInfoToLocal } from "../utils/config";
import axios from "axios";
import { ShowToast } from "../components/utils/ShowToast";

const initialState = {
    user: null,
    loading: false,
    data: null,
    error: null
}

export const authenticate = createAsyncThunk(
    'auth/authenticate',
    async ({ method,data }) => {
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/auth/login`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            const response = await axios(config);
            ShowToast('success', 'Successfully logged in')
            return response.data;
        } catch (error) {
            if(error.code === "ERR_NETWORK"){
                ShowToast('error', error.message)
            }else if(error.response.status === 401){
                ShowToast('error', 'Missing email or password')
            }else{
                ShowToast('error', 'Something went wrong!')
            }
            throw new Error(error);
        }
    }
);

export const createAccount = createAsyncThunk(
    'auth/createAccount',
    async ({ method,data }) => {
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/users`,
                headers: HEADERS(),
                data: data
            };
            const response = await axios(config);
            ShowToast('success', 'Successfully created')
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

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async ({ method,data }) => {
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/auth/forgot-password`,
                data: data
            };
            const response = await axios(config);
            ShowToast('success', 'Password reset link has been sent to you email')
            return response.data;
        } catch (error) {
            ShowToast('error', 'Something went wrong!')
            throw new Error(error);
        }
    }
);

export const verifyToken = createAsyncThunk(
    'auth/verifyToken',
    async ({ method,data,verifyToken }) => {
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/auth/verify-reset-token/${verifyToken}`,
                data: data
            };
            const response = await axios(config);
            return response.data;
        } catch (error) {
            throw new Error(error);
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ method,data }) => {
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/auth/reset-password`,
                data: data
            };
            const response = await axios(config);
            ShowToast('success', 'Successfully updated your password')
            return response.data;
        } catch (error) {
            ShowToast('error', 'Something went wrong!')
            throw new Error(error);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      logOut: ()=>{
        localStorage.removeItem(authName)
      }
    },
    extraReducers: (builder) => {
        builder
        .addCase(authenticate.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(authenticate.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            setInfoToLocal(action.payload)
        })
        .addCase(authenticate.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(createAccount.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createAccount.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(createAccount.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(forgotPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(forgotPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(forgotPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(resetPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(resetPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(resetPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(verifyToken.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(verifyToken.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(verifyToken.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export const { logOut } = authSlice.actions

export default authSlice.reducer;