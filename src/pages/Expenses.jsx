import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material"
import theme from "../utils/theme"
import AppPagination from "../components/main/filter-components/AppPagination"
import DeleteIcon from '@mui/icons-material/Delete';
import StyledTableData from "../components/utils/StyledTableData";
import StyledTableHead from "../components/utils/StyledTableHead";
import SearchInput from "../components/main/filter-components/SearchInput";
import DateFilters from "../components/main/filter-components/DateFilters";
import AddNewExpenses from "../components/expenses_components/AddNewExpenses";
import { useDispatch, useSelector } from "react-redux";
import { expenseCrud, getAllExpense } from "../slices/expenseSlice";
import NoDataAlert from "../components/utils/NoDataAlert";
import { changeDateTime } from "../utils/changeDateTime";
import { useLocation } from "react-router-dom";
import Loading from "../components/utils/Loading";
import AlertDialog from "../components/utils/AlertDialog";

const ExpensesList = () => {
    const [ showAlert,setShowAlert ] = useState(false)
    const [ idToDel,setIdToDel ] = useState(null)
    const dispatch = useDispatch()
    const { search } = useLocation()
    const { expenses: expensesList, loading } = useSelector(state=> state.Expense)
    const [open, setOpen] = useState(false);

    const fetchData = async ()=>{
        await dispatch(getAllExpense({ method: 'get', data: null }))
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
        await dispatch(expenseCrud({ method: 'delete', data: null, id: idToDel }))
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
                content={"You want to delete this expense."}
            ></AlertDialog>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 3
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '60%'
                }}>
                    <Button onClick={()=> setOpen(true)} variant="contained">Add New</Button>
                    <AddNewExpenses open={open} setOpen={setOpen}/>
                    <DateFilters></DateFilters>
                </Box>
                <SearchInput placeholderText={"Search by description"}></SearchInput>
            </Box>
            <TableContainer sx={{ px: 3 }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableHead align="center">No</StyledTableHead>
                            <StyledTableHead>Date</StyledTableHead>
                            <StyledTableHead>Amount</StyledTableHead>
                            <StyledTableHead>Description</StyledTableHead>
                            <StyledTableHead sx={{ textAlign: 'center' }}>Actions</StyledTableHead>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            (expensesList && expensesList.data.length > 0) ?
                            expensesList.data.map((expense, index) => (
                            <TableRow key={index}>
                                <StyledTableData align="center">{((expensesList?.meta?.current_page - 1) * expensesList?.meta?.per_page)+(index + 1)}</StyledTableData>
                                <StyledTableData>{changeDateTime(expense.date)}</StyledTableData>
                                <StyledTableData>{expense.amount}</StyledTableData>
                                <StyledTableData>{expense.description}</StyledTableData>
                                <StyledTableData sx={{ textAlign: 'center' }}>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={() => handleDelete(expense.id)}>
                                            <DeleteIcon sx={{ color: theme.palette.primary.main }} />
                                        </IconButton>
                                    </Tooltip>
                                </StyledTableData>
                            </TableRow>
                            )):
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <NoDataAlert content={"There is no expenses"}></NoDataAlert>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <AppPagination pageCount={expensesList?.meta?.last_page}/>
        </Box>
    )
}

export default ExpensesList