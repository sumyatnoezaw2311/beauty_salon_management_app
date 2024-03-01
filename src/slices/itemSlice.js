import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, HEADERS, getInfoFromLocal } from "../utils/config";
import axios from "axios";
import { ShowToast } from "../components/utils/ShowToast";

const initialState = {
    items: null,
    categories: null,
    damagedItems: null,
    serviceSupplies: null,
    loading: false,
    data: null,
    error: null
}

export const getAllItem = createAsyncThunk(
    'item/getAllItem',
    async ({ method,data,keyword }) => {
        const shop_id = getInfoFromLocal().user.shopId
        const searchParams = new URLSearchParams(window.location.search);
        const pageNo = searchParams.get('page');
        const searchKeyword = searchParams.get('keyword');
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/items?shopId=${shop_id}${keyword || searchKeyword ? `&name=${keyword || searchKeyword}` : '' }${pageNo ? `&page=${pageNo}` : '' }`,
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

export const itemCud = createAsyncThunk(
    'item/itemCud',
    async ({ method,data,id }) => {
        const shop_id = getInfoFromLocal().user.shopId
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/items${id ? `/${id}` : ''}?shopId=${shop_id}`,
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
            throw new Error(error);
        }
    }
);

export const addStock = createAsyncThunk(
    'item/addStock',
    async ({ method,data,id }) => {
        const shop_id = getInfoFromLocal().user.shopId
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/items/add-stock${id ? `/${id}` : ''}?shopId=${shop_id}`,
                headers: HEADERS(),
                data: data
            };
            const response = await axios(config);
            ShowToast('success', 'Successfully added')
            return response.data;
        } catch (error) {
            throw new Error(error);
        }
    }
);

export const getAllDamaged = createAsyncThunk(
    'item/getAllDamaged',
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
                url: `${BASE_URL}/damaged-items?shopId=${shop_id}${pageNo ? `&page=${pageNo}` : ""}${(startDate && endDate) ? `&startDate=${startDate}&endDate=${endDate}`: "" }${keyword ? `&name=${keyword}` : ""}`,
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

export const damagedCud = createAsyncThunk(
    'item/damagedCud',
    async ({ method,data,id }) => {
        const shop_id = getInfoFromLocal().user.shopId
        const searchParams = new URLSearchParams(window.location.search);
        const pageNo = searchParams.get('page');
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/damaged-items${id ? `/${id}` : ''}?shopId=${shop_id}${pageNo ? `&page=${pageNo}`: ""}`,
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

export const getAllServiceSupply = createAsyncThunk(
    'item/getAllServiceSupply',
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
                url: `${BASE_URL}/service-supplies?shopId=${shop_id}${pageNo ? `&page=${pageNo}`: ""}${(startDate && endDate) ? `&startDate=${startDate}&endDate=${endDate}`: "" }${keyword ? `&name=${keyword}` : ""}`,
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

export const serviceSupplyCud = createAsyncThunk(
    'item/serviceSupplyCud',
    async ({ method,data,id }) => {
        const shop_id = getInfoFromLocal().user.shopId
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/service-supplies${id ? `/${id}` : ''}?shopId=${shop_id}`,
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


export const getAllCategory = createAsyncThunk(
    'item/getAllCategory',
    async ({ method,data }) => {
        const shop_id = getInfoFromLocal().user.shopId
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/categories?shopId=${shop_id}`,
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


export const categoryCud = createAsyncThunk(
    'item/categoryCud',
    async ({ method,data,id }) => {
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/categories${id ? `/${id}` : ''}`,
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

const itemSlice = createSlice({
    name: "item",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllItem.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllItem.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
        })
        .addCase(getAllItem.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(itemCud.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(itemCud.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(itemCud.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(addStock.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addStock.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(addStock.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(getAllCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = action.payload;
        })
        .addCase(getAllCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(categoryCud.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(categoryCud.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(categoryCud.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(getAllDamaged.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllDamaged.fulfilled, (state, action) => {
            state.loading = false;
            state.damagedItems = action.payload;
        })
        .addCase(getAllDamaged.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(damagedCud.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(damagedCud.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(damagedCud.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(getAllServiceSupply.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllServiceSupply.fulfilled, (state, action) => {
            state.loading = false;
            state.serviceSupplies = action.payload;
        })
        .addCase(getAllServiceSupply.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(serviceSupplyCud.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(serviceSupplyCud.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(serviceSupplyCud.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})


export default itemSlice.reducer;