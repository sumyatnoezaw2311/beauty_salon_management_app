import { useEffect, useState } from "react";
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material"
import DateFilters from "../components/main/filter-components/DateFilters"
import SearchInput from "../components/main/filter-components/SearchInput"
import StyledTableData from '../components/utils/StyledTableData';
import StyledTableHead from '../components/utils/StyledTableHead';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AppPagination from "../components/main/filter-components/AppPagination"
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getAllReceipts, receiptCud, resetReceipts } from "../slices/receiptSlice";
import NoDataAlert from "../components/utils/NoDataAlert";
import theme from "../utils/theme"
import { changeDateTime } from '../utils/changeDateTime'
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from "../components/utils/Loading";
import AlertDialog from "../components/utils/AlertDialog";


const Purchases = () => {
    const [ showAlert,setShowAlert ] = useState(false)
    const [ idToDel,setIdToDel ] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { receipts: purchaseList, loading } = useSelector(state=> state.Receipt)

    const fetchData = async ()=>{
        await dispatch(resetReceipts())
        await dispatch(getAllReceipts({ method: 'get', data: null, type: 'purchase' }))
    }

    const handleRestore = async (id)=>{
        setShowAlert(true)
        setIdToDel(id)
    }

    const handleCancel = ()=>{
        setShowAlert(false)
        setIdToDel(null)
    }
    
    const handleConfirm = async ()=>{
        await dispatch(receiptCud({ method: 'delete', data: null, id: idToDel, type: 'purchase' }))
        setShowAlert(false)
        setIdToDel(null)
        fetchData();
    }

    const createVoucher = () => {
        navigate(`/create-purchase-voucher`)
    };

    useEffect(()=>{
        fetchData()
    },[window.location.search])

    return (
        <Box sx={{
            bgcolor: theme.palette.common.white,
            borderRadius: '10px',
            pb: 3,
            height: '100%'
        }}>
            { loading && <Loading/> }
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
                alignItems: 'center',
                p: 3
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '60%',
                }}>
                    <Button onClick={createVoucher} variant='contained'>Add New</Button>
                    <DateFilters></DateFilters>
                </Box>
                <SearchInput placeholderText={"Search by account name"}></SearchInput>
            </Box>
            <TableContainer sx={{ px: 3 }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableHead align="center">No</StyledTableHead>
                            <StyledTableHead>Date</StyledTableHead>
                            <StyledTableHead>Voucher Code</StyledTableHead>
                            <StyledTableHead align="center">Total Cost</StyledTableHead>
                            <StyledTableHead>Account Name</StyledTableHead>
                            <StyledTableHead align="center">Actions</StyledTableHead>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {  (purchaseList && purchaseList.data.length > 0) ?
                            purchaseList.data.map((purchase, index) => (
                            <TableRow key={index}>
                                <StyledTableData align="center">{((purchaseList?.meta?.current_page - 1) * purchaseList?.meta?.per_page)+(index + 1)}</StyledTableData>
                                <StyledTableData>{changeDateTime(purchase.date)}</StyledTableData>
                                <StyledTableData>{purchase.code}</StyledTableData>
                                <StyledTableData align="center">{purchase.price}</StyledTableData>
                                <StyledTableData>{purchase.name}</StyledTableData>
                                <StyledTableData align="center">
                                    <Tooltip title="See More">
                                        <Link to={`/purchases/purchase-voucher-detail/${purchase.id}`}>
                                            <IconButton  sx={{ mr: 3 }}>
                                                <RemoveRedEyeIcon sx={{ color: theme.palette.common.purple }} />
                                            </IconButton>
                                        </Link>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={()=> handleRestore(purchase.id)}>
                                            <DeleteIcon sx={{ color: theme.palette.primary.main }} />
                                        </IconButton>
                                    </Tooltip>
                                </StyledTableData>
                            </TableRow>
                            )):
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <NoDataAlert content={"There is no receipts in purchases"}></NoDataAlert>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <AppPagination pageCount={purchaseList?.meta?.last_page} />
        </Box>
    )
}

export default Purchases