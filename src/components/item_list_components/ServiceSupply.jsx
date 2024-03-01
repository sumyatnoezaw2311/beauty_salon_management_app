import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material"
import AppPagination from '../main/filter-components/AppPagination';
import theme from '../../utils/theme';
import DeleteIcon from '@mui/icons-material/Delete';
import StyledTableHead from "../../components/utils/StyledTableHead"
import StyledTableData from "../../components/utils/StyledTableData"
import SearchInput from "../../components/main/filter-components/SearchInput";
import DateFilters from "../../components/main/filter-components/DateFilters";
import { useDispatch, useSelector } from "react-redux";
import { getAllServiceSupply, serviceSupplyCud } from '../../slices/itemSlice';
import CreateUsage from './CreateUsage';
import NoDataAlert from '../utils/NoDataAlert';
import { changeDateTime } from '../../utils/changeDateTime';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../utils/Loading';
import AlertDialog from '../utils/AlertDialog';

const ServiceSupply = () => {
    const [ showAlert,setShowAlert ] = useState(false)
    const [ idToDel,setIdToDel ] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { search } = useLocation()
    const [ createOpen,setCreateOpen ] = React.useState(false)
    const { serviceSupplies: serviceSupplies, loading } = useSelector(state=> state.Item)

    const fetchData = async()=>{
        await dispatch(getAllServiceSupply({ method: 'get', data: null }))
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
        await dispatch(serviceSupplyCud({ method: 'delete', data: null, id: idToDel}))
        setShowAlert(false)
        setIdToDel(null)
        fetchData();
    }

    useEffect(()=>{
        fetchData();
    },[search])

    useEffect(() => {
        navigate("");
    },[]);
 
    return (
        <Grid container spacing={2} sx={{ mt: 1 }}>
            { loading && <Loading/> }
            <AlertDialog
                toggle={showAlert}
                setToggle={setShowAlert}
                cancel={handleCancel}
                confrim={handleConfirm}
                title={"Are you sure?"}
                content={"You want to delete this service supply item."}
            ></AlertDialog>
            <CreateUsage open={createOpen} setOpen={setCreateOpen} type={'ss'}></CreateUsage>
            <Grid item sm={12}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: 4, pt: 1
                }}>
                    <Button onClick={()=> setCreateOpen(true) } variant='contained' sx={{ height: '100%' }}>Add</Button>
                    <DateFilters></DateFilters>
                    <SearchInput placeholderText={"Search by item name"}/>
                </Box>
                    <TableContainer sx={{ px: 3, mt: 3 }}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <StyledTableHead align="center">No</StyledTableHead>
                                    <StyledTableHead>Date & Time</StyledTableHead>
                                    <StyledTableHead>Name</StyledTableHead>
                                    <StyledTableHead align="center">Quantity</StyledTableHead>
                                    <StyledTableHead align="center">Actions</StyledTableHead>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    (serviceSupplies && serviceSupplies.data.length > 0 ) ?
                                    serviceSupplies.data.map((item, index) => (
                                    <TableRow key={index}>
                                        <StyledTableData align="center">{((serviceSupplies?.meta?.current_page - 1) * 10)+(index + 1)}</StyledTableData>
                                        <StyledTableData>{changeDateTime(item.date)}</StyledTableData>
                                        <StyledTableData>{item.name}</StyledTableData>
                                        <StyledTableData align="center">{item.quantity}</StyledTableData>
                                        <StyledTableData align="center">
                                            <Tooltip title="Delete">
                                                <IconButton onClick={()=> handleDelete(item.id)}>
                                                    <DeleteIcon sx={{ color: theme.palette.primary.main }} />
                                                </IconButton>
                                            </Tooltip>
                                        </StyledTableData>
                                    </TableRow>
                                    )):
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <NoDataAlert content={"There is no service supply items"}></NoDataAlert>
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                <AppPagination pageCount={serviceSupplies?.meta?.last_page} />
            </Grid>
        </Grid>
    )
}

export default ServiceSupply;
