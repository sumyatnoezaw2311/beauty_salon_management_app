import React,{ useEffect, useState } from 'react';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material"
import theme from "../../utils/theme";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import StyledTableData from "../utils/StyledTableData";
import StyledTableHead from "../utils/StyledTableHead";
import SearchInput from "../main/filter-components/SearchInput";
import AppPagination from "../main/filter-components/AppPagination";
import CreateNewStock from '../item_list_components/CreateNewStock'
import AddStock from "./AddStock";
import { useDispatch, useSelector } from "react-redux";
import { getAllItem, itemCud } from "../../slices/itemSlice";
import UpdateStock from './UpdateStock';
import NoDataAlert from '../utils/NoDataAlert';
import { useLocation } from 'react-router-dom';
import Loading from '../utils/Loading'
import AlertDialog from '../utils/AlertDialog';

const StockList = () => {
    const dispatch = useDispatch()
    const [ showAlert,setShowAlert ] = useState(false)
    const [ idToDel,setIdToDel ] = useState(null)
    const { search } = useLocation();
    const { items: stockList, loading } = useSelector(state=> state.Item)
    const [ itemData, setItemData ] = React.useState(null)
    const [open, setOpen] = React.useState(false);
    const [ editOpen, setEditOpen] = React.useState(false);
    const [openAddStock, setOpenAddStock] = React.useState(false);
    const [ idToAdd,setIdToAdd ] = React.useState(null)
    
    const fetchData = async()=>{
        await dispatch(getAllItem({ method: 'get', data: null, keyword: null }))
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
        await dispatch(itemCud({ method: 'delete', data: null , id: idToDel }))
        setShowAlert(false)
        setIdToDel(null)
        fetchData();
    }

    useEffect(() => {
        fetchData();
    },[search]);

    return (
        <Box>
            {
                loading && <Loading></Loading>
            }
            <AlertDialog
                toggle={showAlert}
                setToggle={setShowAlert}
                cancel={handleCancel}
                confrim={handleConfirm}
                title={"Are you sure?"}
                content={"You want to delete this item."}
            ></AlertDialog>
            <CreateNewStock open={open} setOpen={setOpen} />
            <UpdateStock oldData={itemData} open={editOpen} setOpen={setEditOpen}></UpdateStock>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 4, py: 3
            }}>
                <Button onClick={() => setOpen(true)} variant='contained'>Add New</Button>
                <SearchInput placeholderText={"Search by item name"}></SearchInput>
            </Box>
            <AddStock open={openAddStock} setOpen={setOpenAddStock} idToAdd={idToAdd} />
            <Box sx={{ height: '100%', px: 3 }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableHead align="center">No</StyledTableHead>
                            <StyledTableHead>Name</StyledTableHead>
                            <StyledTableHead>Item Code</StyledTableHead>
                            <StyledTableHead>Category</StyledTableHead>
                            <StyledTableHead>Sale Price</StyledTableHead>
                            <StyledTableHead>Purchase Price</StyledTableHead>
                            <StyledTableHead align='center'>Commission(%)</StyledTableHead>
                            <StyledTableHead>Stock</StyledTableHead>
                            <StyledTableHead sx={{ textAlign: 'center' }}>Actions</StyledTableHead>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            (stockList && stockList.data && stockList.data.length > 0) ?
                            stockList.data.map((stock, index) => (
                            <TableRow key={index}>
                                <StyledTableData align="center">{((stockList?.meta?.current_page - 1) * stockList?.meta?.per_page)+(index + 1)}</StyledTableData>
                                <StyledTableData>{stock.name}</StyledTableData>
                                <StyledTableData>{stock.code}</StyledTableData>
                                <StyledTableData>{stock.category ? stock.category.name : "No Category"}</StyledTableData>
                                <StyledTableData>{stock.salePrice}</StyledTableData>
                                <StyledTableData>{stock.purchasePrice ? stock.purchasePrice : "...."}</StyledTableData>
                                <StyledTableData align='center'>{stock.commissionPercent ? stock.commissionPercent : "0" }%</StyledTableData>
                                <StyledTableData>{stock.stock}</StyledTableData>
                                <StyledTableData sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                    <Tooltip title="Add Stock">
                                        <IconButton sx={{ mr: 2 }} onClick={() =>{
                                            setOpenAddStock(true)
                                            setIdToAdd(stock.id)
                                        }}><AddCircleOutlineIcon sx={{ color: theme.palette.success.main }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit">   
                                    <IconButton sx={{ mr: 2 }} onClick={() =>{
                                        setEditOpen(true)
                                        setItemData(stock)
                                    }}>
                                        <DriveFileRenameOutlineIcon sx={{ color: theme.palette.warning.main }} />
                                    </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={()=> handleDelete(stock.id)}>
                                            <DeleteIcon sx={{ color: theme.palette.primary.main }} />
                                        </IconButton>
                                    </Tooltip>
                                </StyledTableData>
                            </TableRow>
                        ))
                        :
                            <TableRow>
                                <TableCell colSpan={9}>
                                    <NoDataAlert content={"There is no item in stocks list"}></NoDataAlert>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </Box>
            <AppPagination pageCount={stockList?.meta?.last_page}/>
        </Box>
    )
}

export default StockList