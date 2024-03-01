import React,{ useState } from "react";
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, alpha } from "@mui/material"
import theme from "../utils/theme"
import DateFilters from "../components/main/filter-components/DateFilters"
import SearchInput from "../components/main/filter-components/SearchInput"
import PrintIcon from '@mui/icons-material/Print';
import StyledTableData from '../components/utils/StyledTableData';
import StyledTableHead from '../components/utils/StyledTableHead';
import DeleteIcon from '@mui/icons-material/Delete';
import AppPagination from "../components/main/filter-components/AppPagination"
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllReceipts, receiptCud, resetReceipts } from "../slices/receiptSlice";
import NoDataAlert from '../components/utils/NoDataAlert'
import { changeDateTime } from '../utils/changeDateTime'
import Loading from "../components/utils/Loading";
import AlertDialog from "../components/utils/AlertDialog";

const SaleAndService = () => {

    const dispatch = useDispatch()
    const [ showAlert,setShowAlert ] = useState(false)
    const [ idToDel,setIdToDel ] = useState(null)
    const { receipts: saleAndServiceList, loading } = useSelector(state=> state.Receipt)
    const navigate = useNavigate();

    const fetchData = async ()=>{
        await dispatch(resetReceipts())
        await dispatch(getAllReceipts({ method: 'get', data: null, type: 'sale' }))
    }

    const handleDelete = async (id)=>{
        setShowAlert(true)
        setIdToDel(id)
    }

    const handleCancel = ()=>{
        setShowAlert(false)
        setIdToDel(null)
    }
    
    const handleConfirm = async ()=>{
        await dispatch(receiptCud({ method: 'delete', data: null, type: 'sale', id: idToDel }))
        setShowAlert(false)
        setIdToDel(null)
        fetchData();
    }

    const createVoucher = () => {
        navigate(`/create-sale-voucher`)
    };

    React.useEffect(()=>{
        fetchData()
    },[window.location.search])

    return (
        <Box sx={{
            bgcolor: theme.palette.common.white,
            borderRadius: '10px',
            height: '100%',
            pb: 3
        }}>
            { loading && <Loading></Loading> }
            <AlertDialog
                toggle={showAlert}
                setToggle={setShowAlert}
                cancel={handleCancel}
                confrim={handleConfirm}
                title={"Are you sure?"}
                content={"You want to delete this receipt."}
            ></AlertDialog>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 3
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '60%',
                }}>
                    <Button onClick={createVoucher} variant='contained' sx={{ height: '100%' }}>Add New</Button>
                    <DateFilters></DateFilters>
                </Box>
                <SearchInput placeholderText={"Search by customer name"}></SearchInput>
            </Box>
            <TableContainer sx={{ px: 3 }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableHead align="center">No</StyledTableHead>
                            <StyledTableHead>Date</StyledTableHead>
                            <StyledTableHead>Voucher Code</StyledTableHead>
                            <StyledTableHead>Account Name</StyledTableHead>
                            <StyledTableHead>Customer Name</StyledTableHead>
                            <StyledTableHead>Total Fee</StyledTableHead>
                            <StyledTableHead sx={{ textAlign: 'center' }}>Actions</StyledTableHead>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                        (saleAndServiceList && saleAndServiceList.data.length > 0) ?
                            saleAndServiceList.data.map((saleAndService, index) => (
                            <TableRow key={index}>
                                <StyledTableData align="center">{((saleAndServiceList?.meta?.current_page - 1) * saleAndServiceList?.meta?.per_page)+(index + 1)}</StyledTableData>
                                <StyledTableData>{changeDateTime(saleAndService.date)}</StyledTableData>
                                <StyledTableData>{saleAndService.code}</StyledTableData>
                                <StyledTableData>{saleAndService.userName?.name}</StyledTableData>
                                <StyledTableData>{saleAndService.customerName?.name}</StyledTableData>
                                <StyledTableData>{saleAndService.total_price}</StyledTableData>
                                <StyledTableData sx={{ textAlign: 'center' }}>
                                    <Tooltip title="Print" >
                                        <Link to={`/sales-and-services/sale-voucher-detail/${saleAndService.id}`}>
                                            <IconButton sx={{ mr: 3 }}>
                                                <PrintIcon sx={{ color: theme.palette.common.purple }} />
                                            </IconButton>
                                        </Link>
                                    </Tooltip>
                                    <Tooltip title="Delete" onClick={()=> handleDelete(saleAndService.id) }>                                   
                                        <IconButton>
                                            <DeleteIcon sx={{ color: theme.palette.primary.main }} />
                                        </IconButton>
                                    </Tooltip> 
                                </StyledTableData>
                            </TableRow>
                            )):
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <NoDataAlert content={"There is no receipts for sales and services"}></NoDataAlert>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <AppPagination pageCount={saleAndServiceList?.meta?.last_page} />
        </Box>
    )
}

export default SaleAndService