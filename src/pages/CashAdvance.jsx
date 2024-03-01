import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@mui/material"
import DateFilters from "../components/main/filter-components/DateFilters"
import AppPagination from "../components/main/filter-components/AppPagination"
import StyledTableData from "../components/utils/StyledTableData"
import StyledTableHead from "../components/utils/StyledTableHead"
import DeleteIcon from '@mui/icons-material/Delete';
import theme from "../utils/theme"
import AddCashAdvance from "../components/cash_advance/AddCashAdvance"
import { useDispatch, useSelector } from "react-redux"
import { advanceCud, getAllAdvance } from "../slices/salaryAdvanceSlice"
import NoDataAlert from "../components/utils/NoDataAlert"
import { changeDateTime } from "../utils/changeDateTime"
import { useLocation } from 'react-router-dom';
import SearchInput from '../components/main/filter-components/SearchInput';
import Loading from '../components/utils/Loading';
import AlertDialog from '../components/utils/AlertDialog';

const CashAdvance = () => {
    const [ showAlert,setShowAlert ] = useState(false)
    const [ idToDel,setIdToDel ] = useState(null)
    const [open, setOpen] =useState(false);
    const { search } = useLocation()
    const dispatch = useDispatch()
    const { advances: cashAdvanceList, loading } = useSelector(state=> state.SalaryAdvance)

    const fetchData = async()=>{
        await dispatch(getAllAdvance({ method: 'get', data: null }))
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
        await dispatch(advanceCud({ method: 'delete', data: null, id: idToDel }))
        setShowAlert(false)
        setIdToDel(null)
        fetchData();
      }

    useEffect(()=>{
        fetchData()
    },[search])
    
    return (
        <Box sx={{
            bgcolor: theme.palette.common.white,
            borderRadius: '10px',
            height: '100%',
            p: 3
        }}>
            { loading && <Loading/> }
            <AlertDialog
                toggle={showAlert}
                setToggle={setShowAlert}
                cancel={handleCancel}
                confrim={handleConfirm}
                title={"Are you sure?"}
                content={"You want to delete this salary advance."}
            ></AlertDialog>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 4
            }}>
                <Button onClick={()=> setOpen(true)} variant="contained" sx={{ height: '100%' }}>Add</Button>
                <DateFilters />
                <SearchInput placeholderText={"Search by staff name"}></SearchInput>
                <AddCashAdvance open={open} setOpen={setOpen}/>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableHead align='center'>No</StyledTableHead>
                        <StyledTableHead>Date</StyledTableHead>
                        <StyledTableHead>Staff Name</StyledTableHead>
                        <StyledTableHead align='center'>Amount</StyledTableHead>
                        <StyledTableHead>Note</StyledTableHead>
                        <StyledTableHead align='center'>Action</StyledTableHead>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        (cashAdvanceList && cashAdvanceList.data.length > 0) ?
                        cashAdvanceList.data.map((cashAdvance, index) => (
                        <TableRow key={index}>
                            <StyledTableData align='center'>{((cashAdvanceList?.meta?.current_page - 1) * cashAdvanceList?.meta?.per_page)+(index + 1)}</StyledTableData>
                            <StyledTableData>{changeDateTime(cashAdvance.date)}</StyledTableData>
                            <StyledTableData>{cashAdvance.name}</StyledTableData>
                            <StyledTableData align="center">{cashAdvance.price}</StyledTableData>
                            <StyledTableData>{cashAdvance.description ? cashAdvance.description : '....'}</StyledTableData>
                            <StyledTableData align="center">
                                <Tooltip title="Delete">
                                    <IconButton onClick={()=> handleDelete(cashAdvance.id)}>
                                        <DeleteIcon sx={{
                                            color: theme.palette.primary.main
                                        }}/>
                                    </IconButton>
                                </Tooltip>
                            </StyledTableData>
                        </TableRow>
                        )):
                        <TableRow>
                            <TableCell colSpan={6}>
                                <NoDataAlert content={"There is no records for salary advanced"}></NoDataAlert>
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
            <AppPagination pageCount={cashAdvanceList?.meta?.last_page}/>
        </Box>
    )
}

export default CashAdvance