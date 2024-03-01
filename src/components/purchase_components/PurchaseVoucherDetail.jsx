import { Box, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import theme from "../../utils/theme";
import StyledTableData from "../utils/StyledTableData";
import StyledTableHead from "../utils/StyledTableHead";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReceipt } from "../../slices/receiptSlice";
import { changeDateTime } from "../../utils/changeDateTime";
import Loading from "../utils/Loading";

const PurchaseVoucherDetail = () => {

    const { id } = useParams()
    const dispatch = useDispatch()
    const { receipt: purchase, loading } = useSelector(state=> state.Receipt)
    
    const fetchReceipt = async ()=>{
        await dispatch(getReceipt({ method: 'get', data: null, id: id, type: 'purchase' }))
    }

    useEffect(()=>{
        fetchReceipt()
    },[])

    return (
        <Box sx={{
            bgcolor: theme.palette.common.white,
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            height: '100%'
        }}>
            { loading && <Loading/> }
             <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: '30px'
                }}>
                    <Typography sx={{ fontWeight: 'bold' }}>Date - {purchase?.purchase?.date && changeDateTime(purchase.purchase.date)}</Typography>
                    <Typography sx={{ fontWeight: 'bold' }}>Voucher Code - {purchase?.purchase?.code}</Typography>
                    <Typography sx={{ fontWeight: 'bold' }}>Total Cost - {purchase?.purchase?.price}</Typography>
                </Box>
                <TableContainer sx={{ px: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableHead align="center">No</StyledTableHead>
                                <StyledTableHead>Item Name</StyledTableHead>
                                <StyledTableHead align="center">Quantity</StyledTableHead>
                                <StyledTableHead align="center">Total</StyledTableHead>
                                {/* <StyledTableHead>Actions</StyledTableHead> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                (purchase && purchase.purchaseDetails) &&
                                purchase.purchaseDetails.map((item, index) => (
                                <TableRow key={index}>
                                    <StyledTableData align="center">{index + 1}</StyledTableData>
                                    <StyledTableData>{item.name}</StyledTableData>
                                    <StyledTableData align="center">{item.quantity}</StyledTableData>
                                    <StyledTableData align="center">{item.price * item.quantity}</StyledTableData>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
        </Box>
    )
}

export default PurchaseVoucherDetail