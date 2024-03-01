import { useState, useEffect } from "react";
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material"
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AppPagination from "../components/main/filter-components/AppPagination";
import SearchInput from "../components/main/filter-components/SearchInput";
import StyledTableHead from "../components/utils/StyledTableHead";
import StyledTableData from "../components/utils/StyledTableData";
import theme from "../utils/theme";
import CreateNewService from "../components/service_components/CreateNewService";
import { useDispatch, useSelector } from "react-redux";
import { getAllServices, serviceCud } from "../slices/serviceSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateService from "../components/service_components/UpdateService";
import NoDataAlert from "../components/utils/NoDataAlert"
import Loading from "../components/utils/Loading";
import AlertDialog from "../components/utils/AlertDialog";

const ServiceList = () => {
    const [ showAlert,setShowAlert ] = useState(false)
    const [ idToDel,setIdToDel ] = useState(null)
    const { services: serviceList, loading } = useSelector(state=> state.Service)
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [ serviceData,setServiceData ] = useState(null)

    const fetchData = async ()=>{
        await dispatch(getAllServices({ method: 'get', data: null }))
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
        await dispatch(serviceCud({ method: 'delete', data: null, id: idToDel }))
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
                content={"You want to delete this service."}
            ></AlertDialog>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 3
            }}>
                <Button onClick={() => setOpen(true)} variant='contained' sx={{ height: '100%' }}>Add New</Button>
                <CreateNewService open={open} setOpen={setOpen} />
                <UpdateService open={editOpen} setOpen={setEditOpen} oldData={serviceData} ></UpdateService>
                <SearchInput placeholderText={'Search by service name'}></SearchInput>
            </Box>
            <TableContainer sx={{ px: 3 }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableHead align="center">No</StyledTableHead>
                            <StyledTableHead>Name</StyledTableHead>
                            <StyledTableHead>Price</StyledTableHead>
                            <StyledTableHead align="center">Normal Commission (%)</StyledTableHead>
                            <StyledTableHead align="center">Byname Commission (%)</StyledTableHead>
                            <StyledTableHead sx={{ textAlign: 'center' }}>Actions</StyledTableHead>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            (serviceList && serviceList.data.length > 0 ) ?
                            serviceList.data.map((service, index) => (
                            <TableRow key={index}>
                                <StyledTableData align="center">{((serviceList?.meta?.current_page - 1) * serviceList?.meta?.per_page)+(index + 1)}</StyledTableData>
                                <StyledTableData>{service.name}</StyledTableData>
                                <StyledTableData>{service.price}</StyledTableData>
                                <StyledTableData align="center">{service.normalCommissionPercent}%</StyledTableData>
                                <StyledTableData align="center">{service.bynameCommissionPercent}%</StyledTableData>
                                <StyledTableData align="center">
                                    <Tooltip title="Edit">
                                        <IconButton sx={{ mr: 2 }} onClick={()=>{
                                            setEditOpen(true)
                                            setServiceData(service)                                   
                                        }}>
                                            <DriveFileRenameOutlineIcon sx={{ color: theme.palette.warning.main }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={()=> handleDelete(service.id)}>
                                            <DeleteIcon sx={{ color: theme.palette.primary.main }} />
                                        </IconButton>
                                    </Tooltip>
                                </StyledTableData>
                            </TableRow>
                            )):
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <NoDataAlert content={"There is no services"}></NoDataAlert>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <AppPagination pageCount={serviceList?.meta?.last_page}/>
        </Box>
    )
}

export default ServiceList