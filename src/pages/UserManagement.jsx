import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material"
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import DeleteIcon from '@mui/icons-material/Delete';
import AppPagination from "../components/main/filter-components/AppPagination";
import SearchInput from "../components/main/filter-components/SearchInput";
import StyledTableHead from "../components/utils/StyledTableHead";
import StyledTableData from "../components/utils/StyledTableData";
import theme from "../utils/theme";
import { Link, useLocation } from 'react-router-dom';
import AddNewAccount from "../components/user_management_components/AddNewAccount";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, userCrud } from "../slices/userSlice";
import NoDataAlert from "../components/utils/NoDataAlert";
import Loading from "../components/utils/Loading";
import AlertDialog from "../components/utils/AlertDialog";

const UserManagement = () => {
    const [ showAlert,setShowAlert ] = useState(false)
    const [ idToDel,setIdToDel ] = useState(null)
    const dispatch = useDispatch()
    const { search } = useLocation()
    const { users: users, loading } = useSelector(state=> state.User)
    const [open, setOpen] = useState(false);

    const fetchData = async()=>{
        await dispatch(getAllUsers({ method: 'get', data: null }))
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
        await dispatch(userCrud({ method: 'delete', data: null, id: idToDel }))
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
            pb: 3
        }}>
            { loading && <Loading/> }
            <AlertDialog
                toggle={showAlert}
                setToggle={setShowAlert}
                cancel={handleCancel}
                confrim={handleConfirm}
                title={"Are you sure?"}
                content={"You want to delete this user."}
            ></AlertDialog>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 3,
            }}>
                <Button onClick={() => setOpen(true)} variant="contained" sx={{ height: '100%' }}>Add New</Button>
                <AddNewAccount open={open} setOpen={setOpen} />
                <SearchInput placeholderText={"Search by user name"}/>
            </Box>
            <TableContainer sx={{ px: 3 }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableHead>No</StyledTableHead>
                            <StyledTableHead>Name</StyledTableHead>
                            <StyledTableHead align="center">Account Type</StyledTableHead>
                            <StyledTableHead>Position</StyledTableHead>
                            <StyledTableHead>Email</StyledTableHead>
                            <StyledTableHead align="center">Actions</StyledTableHead>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            (users && users.data.length > 0) ?
                            users.data.map((user, index) => (
                            <TableRow key={index}>
                                <StyledTableData>{((users?.meta?.current_page - 1) * users?.meta?.per_page)+(index + 1)}</StyledTableData>
                                <StyledTableData>{user.name}</StyledTableData>
                                <StyledTableData align="center" sx={{ textTransform: 'capitalize' }}>{user.type}</StyledTableData>
                                <StyledTableData>{user.position}</StyledTableData>
                                <StyledTableData>{user.email}</StyledTableData>
                                <StyledTableData align="center">
                                    <Tooltip title="Permissions">
                                        <Link to={`/user-management/permission-controls-for-user/${user.id}`}>
                                            <IconButton sx={{ mr: 3 }}>
                                                <PrivacyTipIcon sx={{ color: theme.palette.success.main }} />
                                            </IconButton>
                                        </Link>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={()=>{ handleDelete(user.id) }}>
                                            <DeleteIcon sx={{ color: theme.palette.primary.main }} />
                                        </IconButton>
                                    </Tooltip>
                                </StyledTableData>
                            </TableRow>
                            )):
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <NoDataAlert content={"There is no users"}></NoDataAlert>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <AppPagination pageCount={users?.meta?.last_page} />
        </Box>
    )
}

export default UserManagement