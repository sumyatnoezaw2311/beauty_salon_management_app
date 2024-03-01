import React, { useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import StyledTableData from '../components/utils/StyledTableData';
import StyledTableHead from '../components/utils/StyledTableHead';
import CreateNewShop from '../components/shoplist_components/CreateNewShop';
import UpdateShop from '../components/shoplist_components/UpdateShop';
import { getAllShops, shopCud } from '../slices/shopSlice';
import NoDataAlert from '../components/utils/NoDataAlert'
import theme from '../utils/theme';
import Loading from '../components/utils/Loading'
import MoveOtherShop from '../components/staff_components/MoveOtherShop';
import AlertDialog from '../components/utils/AlertDialog';
import { getInfoFromLocal } from '../utils/config';

const ShopsList = () => {
    const [ showAlert,setShowAlert ] = useState(false)
    const [ idToDel,setIdToDel ] = useState(null)
    const [open, setOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [ shopData,setShopData ] = useState(null)
    const dispatch = useDispatch();
    const { shops: shopsList, loading } = useSelector((state) => state.Shop);
    const [openMoveToShopDialog, setOpenMoveToShopDialog] = useState(false);

    const fetchData = async () => {
        await dispatch(getAllShops({ method: 'get', data: null }));
    };

    const handleUpdate = async (shopData)=>{
        setShopData(shopData);
        setUpdateOpen(true)
    }

    const handleDelete = (id) => {
        setShowAlert(true)
        setIdToDel(id)
    };

    const handleCancel = ()=>{
        setShowAlert(false)
        setIdToDel(null)
    }
    
    const handleConfirm = async ()=>{
        await dispatch(shopCud({ method: 'delete', data: null, id: idToDel }));
        setShowAlert(false)
        setIdToDel(null)
        fetchData();
    }

    const handleTransfer = (shop)=>{
        setOpenMoveToShopDialog(true)
        setShopData(shop)
    }

    useEffect(() => {
        fetchData();
    }, []);    

    return (
        <Box sx={{
            bgcolor: theme.palette.common.white,
            borderRadius: '10px',
            pb: 3,
            height: '100%',
        }}>
            {
                loading && <Loading></Loading>
            }
            <AlertDialog
                toggle={showAlert}
                setToggle={setShowAlert}
                cancel={handleCancel}
                confrim={handleConfirm}
                title={"Are you sure?"}
                content={"You want to delete this shop."}
            ></AlertDialog>
            <MoveOtherShop open={openMoveToShopDialog} setOpen={setOpenMoveToShopDialog} shopData={shopData} />
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 3,
            }}>
                <Button onClick={() => setOpen(true)} variant='contained'>Add New</Button>
                <CreateNewShop open={open} setOpen={setOpen} />
                <UpdateShop open={updateOpen} setOpen={setUpdateOpen} oldData={shopData} />
            </Box>
            <Box>
                <TableContainer sx={{ px: { lg: 1 , xl: 3 } }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <StyledTableHead align='center'>No</StyledTableHead>
                                <StyledTableHead>Name</StyledTableHead>
                                <StyledTableHead>Phone Number</StyledTableHead>
                                <StyledTableHead>Address</StyledTableHead>
                                <StyledTableHead align='center'>Actions</StyledTableHead>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { (shopsList && shopsList.data.length > 0 ) ?
                                shopsList.data.map((shop, index) => (
                                <TableRow key={index}>
                                    <StyledTableData align='center'>{index + 1}</StyledTableData>
                                    <StyledTableData>{shop.name}</StyledTableData>
                                    <StyledTableData>{shop.phone}</StyledTableData>
                                    <StyledTableData>{shop.address}</StyledTableData>
                                    <StyledTableData align='center' sx={{ whiteSpace: 'nowrap' }}>
                                        {
                                            getInfoFromLocal().user.type === 'owner' &&
                                            <Tooltip title={"Employee Transfer"} onClick={()=> handleTransfer(shop)}>
                                                <IconButton color='info' sx={{ mr: 2 }}>
                                                    <SettingsIcon/>
                                                </IconButton>
                                            </Tooltip>
                                        }                                        
                                        <Tooltip title={"Edit"}>
                                            <IconButton onClick={()=> handleUpdate(shop) } sx={{ mr: 2 }}>
                                                <DriveFileRenameOutlineIcon sx={{ color: theme.palette.warning.main }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={"Delete"}>
                                            <IconButton onClick={() => handleDelete(shop.id)}>
                                                <DeleteIcon sx={{ color: theme.palette.primary.main }} />
                                            </IconButton>
                                        </Tooltip>
                                    </StyledTableData>
                                </TableRow>
                            )): 
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <NoDataAlert content={"There is no shops"}></NoDataAlert>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default ShopsList;
