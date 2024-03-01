import React, { useEffect } from "react"
import { Box, Divider } from "@mui/material"
import theme from "../../utils/theme"
import AddMembership from "./create_sale_voucher_components/AddMembership"
import AddItem from "./create_sale_voucher_components/AddItem"
import AddService from "./create_sale_voucher_components/AddService"
import VoucherDetail from "./create_sale_voucher_components/VoucherDetail"
import { useDispatch } from "react-redux"
import { resetSale } from "../../slices/receiptSlice"

const CreateSaleVoucher = () => {

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(resetSale())
    },[])

    return (
        <Box sx={{
            bgcolor: theme.palette.common.white,
            borderRadius: '10px',
            height: '100%',
            display: 'flex'
        }}>
            <Box sx={{
                width: "40%",
                px: 2
            }}>
                <AddMembership />
                <Divider />
                <AddService />                
                <Divider />
                <AddItem />
            </Box>
            <Divider orientation="vertical" flexItem />
            <VoucherDetail />
        </Box>
    )
}

export default CreateSaleVoucher