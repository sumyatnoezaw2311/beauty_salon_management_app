import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, HEADERS, getInfoFromLocal, shopId } from "../utils/config";
import axios from "axios";
import { ShowToast } from "../components/utils/ShowToast";

const initialState = {
    staffToMove: [],
    staffDetail: null,
    staffs: null,
    totalSaving: null,
    loading: false,
    data: null,
    error: null
}

export const getAllStaff = createAsyncThunk(
    'staff/getAllStaff',
    async ({ method,data,keyword,shop }) => {
        const shop_id = getInfoFromLocal().user.shopId
        const searchParams = new URLSearchParams(window.location.search);
        const pageNo = searchParams.get('page');
        const searchKeyword = searchParams.get('keyword')
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/employees?shopId=${shop || shop_id}${keyword || searchKeyword ? `&name=${keyword || searchKeyword}` : '' }${pageNo ? `&page=${pageNo}`: ""}`,
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

export const getStaffDetail = createAsyncThunk(
    'staff/getStaffDetail',
    async ({ method,date,shop, id }) => {
        const shop_id = getInfoFromLocal().user.shopId
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/employees/${id ? id: ""}?shopId=${shop ? shop : shop_id}${date ? `&date=${date}` : '' }`,
                headers: HEADERS(),
                data: null
            };
            const response = await axios(config);
            return response.data;
        } catch (error) {
            ShowToast('error', 'Something went wrong')
            throw new Error(error);
        }
    }
);


export const staffCud = createAsyncThunk(
    'staff/staffCud',
    async ({ method,data,id }) => {
        const shop_id = getInfoFromLocal().user.shopId
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/employees${id ? `/${id}` : ''}?shopId=${shop_id}`,
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

export const employeeTrans = createAsyncThunk(
    'staff/employeeTrans',
    async ({ method,data }) => {
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/employees/move-employees`,
                headers: HEADERS(),
                data: data
            };
            const response = await axios(config);
            if(method === 'patch'){
                ShowToast('success', 'Successfully transfered')
            }
            return response.data;
        } catch (error) {
            if(error.status === '403'){
                ShowToast('error', 'Access denied!')
            }else{
                ShowToast('error', 'Something went wrong!')
            }
            throw new Error(error);
        }
    }
);

export const staffTotalSaving = createAsyncThunk(
    'staff/totalSaving',
    async ({ method,data, id }) => {
        const shop_id = getInfoFromLocal().user.shopId
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/employees/${id}/total-savings?shopId=${shop_id}`,
                headers: HEADERS(),
                data: data
            };
            const response = await axios(config);
            return response.data;
        } catch (error) {
            throw new Error(error);
        }
    }
)

const staffSlice = createSlice({
    name: "staff",
    initialState,
    reducers: { },
    extraReducers: (builder) => {
        builder
        .addCase(getAllStaff.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllStaff.fulfilled, (state, action) => {
            state.loading = false;
            state.staffs = action.payload;
        })
        .addCase(getAllStaff.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(getStaffDetail.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getStaffDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.staffDetail = action.payload;
        })
        .addCase(getStaffDetail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(staffCud.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(staffCud.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(staffCud.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(employeeTrans.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(employeeTrans.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(employeeTrans.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(staffTotalSaving.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(staffTotalSaving.fulfilled, (state, action) => {
            state.loading = false;
            state.totalSaving = action.payload;
        })
        .addCase(staffTotalSaving.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})


export default staffSlice.reducer;