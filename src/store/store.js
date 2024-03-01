import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import userReducer from "../slices/userSlice";
import dashboardReducer from "../slices/dashboardSlice";
import shopReducer from "../slices/shopSlice";
import itemReducer from "../slices/itemSlice";
import receiptReducer from "../slices/receiptSlice";
import serviceReducer from "../slices/serviceSlice";
import customerReducer from "../slices/customerSlice";
import staffReducer from "../slices/staffSlice";
import expenseReducer from "../slices/expenseSlice";
import salaryAdvanceReducer from "../slices/salaryAdvanceSlice";
import reportReducer from "../slices/reportSlice";
import membershipReducer from "../slices/membershipSlice";
import salaryReducer from "../slices/salarySlice";
import attendenceReducer from "../slices/attendenceSlice";

export const appStore = configureStore({
    reducer: {
        Auth: authReducer,
        User: userReducer,
        Shop: shopReducer,
        Dashboard: dashboardReducer,
        Item: itemReducer,
        Receipt: receiptReducer,
        Service: serviceReducer,
        Customer: customerReducer,
        Staff: staffReducer,
        Expense: expenseReducer,
        Salary: salaryReducer,
        SalaryAdvance: salaryAdvanceReducer,
        Report: reportReducer,
        Membership: membershipReducer,
        Attendence: attendenceReducer,
    }
})