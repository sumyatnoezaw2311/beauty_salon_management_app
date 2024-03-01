import React from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import PrivateRoutes from "./PrivateRoute";
// import Login from "../pages/auth/Login";
// import Register from "../pages/auth/Register";

//admin panel
import AdminLayout from '../components/layouts/AdminLayout'
import Dashboard from "../pages/Dashboard";
import ShopsList from "../pages/ShopsList";
import SaleAndService from "../pages/SaleAndService";
import Purchases from "../pages/Purchase";
import ItemList from "../pages/itemList";
import ServiceList from "../pages/ServiceList";
import CustomerList from "../pages/CustomerList";
import MemberList from "../pages/MemberList";
import StaffList from "../pages/StaffList";
import Attendance from "../pages/Attendance";
import Salary from "../pages/Salary";
import UserManagement from "../pages/UserManagement";
import PermissionControlForUser from "../components/user_management_components/PermissionControlForUser";
import CreateSaleVoucher from "../components/sale_components/CreateSaleVoucher";
import SaleVoucherDetail from '../components/sale_components/SaleVoucherDetail'
import CreatePurchaseVoucher from "../components/purchase_components/CreatePurchaseVoucher";
import PurchaseVoucherDetail from "../components/purchase_components/PurchaseVoucherDetail";
import CashAdvance from "../pages/CashAdvance";
import ExpensesList from "../pages/Expenses";
import Report from "../pages/Report";
import CreateNewStaff from "../components/staff_components/CreateNewStaff";
import StaffDetail from "../components/staff_components/StaffDetail";
// import StockDetail from "../components/item_list_components/StockDetail";
import Login from "../pages/auth/Login";
import NotFound from "../pages/auth/NotFound";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

const BackOffice = () => {
  const { page } = useParams();
  let component;
  switch (page) {
    // case "dashboard":
    //   component = <Dashboard />;
    //   break;
    case "shops-list":
      component = <ShopsList />;
      break;
    case "sales-and-services":
      component = <SaleAndService />;
      break;
    case "create-sale-voucher":
      component = <CreateSaleVoucher />;
      break;
    case "purchases":
      component = <Purchases />;
      break;
    case "create-purchase-voucher":
      component = <CreatePurchaseVoucher />;
      break;
    case "items":
      component = <ItemList />;
      break;
    case "services":
      component = <ServiceList />;
      break;
    case "customers":
      component = <CustomerList />;
      break;
    case "members":
      component = <MemberList />;
      break;
    case "staff":
      component = <StaffList />;
      break;
    case "create-new-staff":
      component = <CreateNewStaff />;
      break;
    case "attendance":
      component = <Attendance />;
      break;
    case "salary":
      component = <Salary />;
      break;
    case 'cash-advance':
      component = <CashAdvance />
      break;
    case "expenses":
      component = <ExpensesList />;
      break;
    case "report":
      component = <Report />;
      break;
    case "user-management":
      component = <UserManagement />;
      break;
    default:
      component = <NotFound></NotFound>;
      break;
  }
  return component;
};

const AppRouters = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword/>}></Route>
        <Route path="/reset-password/:oneTimeToken" element={<ResetPassword/>}></Route>
        <Route path="/" element={<PrivateRoutes />}>
          <Route path="/" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/:page" element={<AdminLayout><BackOffice /></AdminLayout>} />
          <Route path="/sales-and-services/sale-voucher-detail/:id" element={<AdminLayout><SaleVoucherDetail /></AdminLayout>}/>
          <Route path="/purchases/purchase-voucher-detail/:id" element={<AdminLayout><PurchaseVoucherDetail /></AdminLayout>} />
          <Route path="/staff/staff-detail/:id" element={<AdminLayout><StaffDetail /></AdminLayout>} />
          <Route path="/user-management/permission-controls-for-user/:id" element={<AdminLayout><PermissionControlForUser /></AdminLayout>} />
        </Route>
        <Route path="/*" element={<NotFound/>}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouters;
