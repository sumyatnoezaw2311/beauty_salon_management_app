import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, HEADERS, getInfoFromLocal, shopId } from "../utils/config";
import axios from "axios";
import { ShowToast } from "../components/utils/ShowToast";

const initialState = {
    customer: null,
    saleCollections: [],
    collectedItems: [],
    receipts: null,
    receipt: null,
    loading: false,
    data: null,
    error: null
}

export const getAllReceipts = createAsyncThunk(
    'receipt/getAllReceipts',
    async ({ method,data, type }) => {
        const shop_id = getInfoFromLocal().user.shopId
        const searchParams = new URLSearchParams(window.location.search);
        const pageNo = searchParams.get('page');
        const startDate = searchParams.get('start_date')    
        const endDate = searchParams.get('end_date')
        const keyword = searchParams.get('keyword')
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/${type === "sale" ? "receipts" : "purchases"}?shopId=${shop_id}${pageNo ? `&page=${pageNo}` : ""}${(startDate && endDate) ? `&startDate=${startDate}&endDate=${endDate}`: "" }${keyword ? `&name=${keyword}` : ""}`,
                headers: HEADERS(),
                data: data
            };
            const response = await axios(config);
            return response.data;
        } catch (error) {
            if(error.code === "ERR_NETWORK"){
                ShowToast('error', error.message)
            }else{
                ShowToast('error', 'Something went wrong')
            }
            throw new Error(error);
        }
    }
);

export const getReceipt = createAsyncThunk(
    'receipt/getReceipt',
    async ({ method,data, type, id }) => {
        const shop_id = getInfoFromLocal().user.shopId
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/${type === "sale" ? "receipts" : "purchases"}${id ? `/${id}` : "" }?shopId=${shop_id}`,
                headers: HEADERS(),
                data: data
            };
            const response = await axios(config);
            return response.data;
        } catch (error) {
            ShowToast('error', 'Something went wrong')
            throw new Error(error);
        }
    }
);

export const receiptCud = createAsyncThunk(
    'receipt/receiptCud',
    async ({ method,data, type, id }) => {
        const shop_id = getInfoFromLocal().user.shopId
        try {
            const config = {
                method: method,
                url: `${BASE_URL}/${type === "sale" ? "receipts" : "purchases"}${id ? `/${id}` : ""}?shopId=${shop_id}`,
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

const receiptSlice = createSlice({
    name: "receipt",
    initialState,
    reducers: {
        resetReceipts: (state,)=>{
            state.receipts = null
        },
        collectSale: (state,action)=>{
            state.saleCollections.push(action.payload)
        },
        removeSale: (state,action)=>{
            state.saleCollections = state.saleCollections.filter(item=> item.id !== action.payload)
        },
        resetSale: (state)=>{
            state.saleCollections = []
        },
        collectItem: (state, action)=>{
            state.collectedItems.push(action.payload)
        },
        removeItem: (state,action)=>{
            state.collectedItems = state.collectedItems.filter(item=> item.id !== action.payload)
        },
        resetItem: (state)=>{
            state.collectedItems = []
        },
        getCustomer: (state, action) => {
            const prev = JSON.parse(JSON.stringify(state));
            if(prev && prev.customer && prev.customer.id){
                const cols = JSON.parse(JSON.stringify(state)).saleCollections;
                const filteredCols = cols.filter(col => !col.hasOwnProperty('membership'))
                state.saleCollections = filteredCols
            }            
            state.customer = action.payload;
        }        
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllReceipts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllReceipts.fulfilled, (state, action) => {
            state.loading = false;
            state.receipts = action.payload;
        })
        .addCase(getAllReceipts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(getReceipt.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getReceipt.fulfilled, (state, action) => {
            state.loading = false;
            state.receipt = action.payload;
        })
        .addCase(getReceipt.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(receiptCud.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(receiptCud.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(receiptCud.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export const { collectItem, removeItem, resetItem, getCustomer, collectSale, removeSale, resetSale, resetReceipts } = receiptSlice.actions

export default receiptSlice.reducer;