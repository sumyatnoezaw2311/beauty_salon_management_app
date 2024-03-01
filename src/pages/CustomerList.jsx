import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material"
import AppPagination from "../components/main/filter-components/AppPagination";
import SearchInput from "../components/main/filter-components/SearchInput";
import StyledTableHead from "../components/utils/StyledTableHead";
import StyledTableData from "../components/utils/StyledTableData";
import CreateNewCustomer from "../components/customer_components/CreateNewCustomer";
import { useDispatch, useSelector } from "react-redux";
import { customerCud, getAllCus } from "../slices/customerSlice";
import DriveFileRenameOutline from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateCustomer from "../components/customer_components/UpdateCustomer";
import NoDataAlert from "../components/utils/NoDataAlert";
import theme from "../utils/theme";
import Loading from '../components/utils/Loading';
import AlertDialog from '../components/utils/AlertDialog';

const CustomerList = () => {
    const [ showAlert,setShowAlert ] = useState(false)
    const [ idToDel,setIdToDel ] = useState(null)
    const dispatch = useDispatch()
    const { customers: customerList, loading} = useSelector(state=>state.Customer)
    const [ editOpen,setEditOpen ] = useState(false)
    const [ cusData,setCusData ] = useState(null)
    const [openCreateCustomerDialog, setOpenCreateCustomerDialog] = useState(false);

    const fetchData = async()=>{
        await dispatch(getAllCus({ method: 'get', data: null, keyword: "" }))
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
        await dispatch(customerCud({ method: 'delete', data: null , id: idToDel }))
        setShowAlert(false)
        setIdToDel(null)
        fetchData();
    }

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
                content={"You want to delete this customer."}
            ></AlertDialog>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 3
            }}>
                <Box sx={{
                    display: 'flex',
                }}>
                    <Button onClick={() => setOpenCreateCustomerDialog(true)} variant='contained' sx={{ height: '100%' }}>Add New</Button>
                    <CreateNewCustomer open={openCreateCustomerDialog} setOpen={setOpenCreateCustomerDialog} />
                    <UpdateCustomer oldData={cusData} open={editOpen} setOpen={setEditOpen}></UpdateCustomer>
                </Box>
                <SearchInput placeholderText={"Search by customer name"}></SearchInput>
            </Box>
            <TableContainer sx={{ px: 3 }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableHead align="center">No</StyledTableHead>
                            <StyledTableHead>Name</StyledTableHead>
                            <StyledTableHead>Address</StyledTableHead>
                            <StyledTableHead align='center'>Phone</StyledTableHead>
                            <StyledTableHead sx={{ textAlign: 'center' }}>Actions</StyledTableHead>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            (customerList && customerList.data.length > 0) ?
                            customerList.data.map((customer, index) => (
                            <TableRow key={index}>
                                <StyledTableData align="center">{((customerList?.meta?.current_page - 1) * customerList?.meta?.per_page)+(index + 1)}</StyledTableData>
                                <StyledTableData>{customer.name}</StyledTableData>
                                <StyledTableData>{customer.address ? customer.address : "....."}</StyledTableData>
                                <StyledTableData align='center'>{customer.phone || "...."}</StyledTableData>
                                <StyledTableData sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                    <Tooltip title="Edit">
                                        <IconButton sx={{ mr: 2 }} onClick={()=>{
                                            setEditOpen(true)
                                            setCusData(customer)                                   
                                        }}>
                                            <DriveFileRenameOutline sx={{ color: theme.palette.warning.main }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={()=> handleDelete(customer.id)}>
                                            <DeleteIcon sx={{ color: theme.palette.primary.main }} />
                                        </IconButton>
                                    </Tooltip>
                                </StyledTableData>
                            </TableRow>
                            )):
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <NoDataAlert content={"There is no customers"}></NoDataAlert>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <AppPagination pageCount={customerList?.meta?.last_page}/>
        </Box>
    )
}

export default CustomerList