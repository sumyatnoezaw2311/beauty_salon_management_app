import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, HEADERS } from "../utils/config";
import axios from "axios";
import { ShowToast } from "../components/utils/ShowToast";

const initialState = {
    memberships: null,
    loading: false,
    data: null,
    error: null
}

export const getMembershipRec = createAsyncThunk(
    'membership/getMembershipRec',
    async ({ method,data,keyword,cusId }) => {
        const searchParams = new URLSearchParams(window.location.search);
        const pageNo = searchParams.get('page');    
        const startDate = searchParams.get('start_date')    
        const endDate = searchParams.get('end_date')
        const searchKeyword = searchParams.get('keyword')
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/membership-records?${keyword || searchKeyword ? `serviceName=${keyword || searchKeyword}` : ""}${cusId ? `&customerId=${cusId}`: ""}${pageNo ? `&page=${pageNo}`: ""}${startDate && endDate ? `&startDate=${startDate}&endDate=${endDate}`: ""}`,
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

export const membershipCud = createAsyncThunk(
    'membership/membershipCud',
    async ({ method,data }) => {
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/membership-records`,
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

const membershipSlice = createSlice({
    name: "membership",
    initialState,
    reducers: {
        resetMembership: (state,action)=>{
            state.memberships = []
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getMembershipRec.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getMembershipRec.fulfilled, (state, action) => {
            state.loading = false;
            state.memberships = action.payload;
        })
        .addCase(getMembershipRec.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(membershipCud.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(membershipCud.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(membershipCud.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export const { resetMembership } = membershipSlice.actions

export default membershipSlice.reducer;