import * as React from 'react';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import AppPagination from "../components/main/filter-components/AppPagination";
import StyledTableHead from "../components/utils/StyledTableHead";
import StyledTableData from "../components/utils/StyledTableData";
import theme from "../utils/theme";
import DatePicker, { ReactDatePicker } from "react-datepicker";
import AsyncAutoComplete from '../components/utils/AsyncAutoComplete';
import { useDispatch, useSelector } from 'react-redux';
import { getAllStaff } from '../slices/staffSlice';
import SalaryAdjustDialog from '../components/attendence/SalaryAdjustDialog';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { attReport, getAttendenceBonus } from '../slices/attendenceSlice';
import AttBonusEdit from '../components/attendence/AttBonusEdit';
import Loading from '../components/utils/Loading'
import UploadAttFile from '../components/attendence/UploadAttFile';
import { changeDate, formatTime } from '../utils/changeDateTime';
import { useLocation } from 'react-router-dom';
import SearchInput from '../components/main/filter-components/SearchInput';
import MonthFilter from '../components/main/filter-components/MonthFilter';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import IsoIcon from '@mui/icons-material/Iso';
import AlertDialog from '../components/utils/AlertDialog';
import { format } from 'date-fns';
import { getInfoFromLocal } from '../utils/config';
import NoDataAlert from '../components/utils/NoDataAlert';

const Attendance = () => {

    const dispatch = useDispatch()
    const { search } = useLocation()
    const [ showAlert,setShowAlert ] = React.useState(false)
    const [ diaOpen,setDiaOpen ] = React.useState(false)
    const [ editDiaOpen,setEditDiaOpen ] = React.useState(false)
    const [ delLogOpen,setDelLogOpen ] = React.useState(false)
    const [ pageCount,setPageCount ] = React.useState(1)
    const [ selectedDate,setSelectedDate ] = React.useState(null)
    const { attendenceBonus,attData, loading: Attloading } = useSelector(state=> state.Attendence)
    const [ oldData,setOldData ] = React.useState(null)

    const fetchAttendenceBonus = async ()=>{
        await dispatch(getAttendenceBonus({ method: 'get', data: null }))
    }

    const fetchData = async ()=>{
        await dispatch(attReport({ method: 'get', data: null }))
    }

    const handleDelete = async()=>{
        setShowAlert(true)
    }

    const handleCancel = ()=>{
        setShowAlert(false)
    }

    const handleConfirm = async ()=>{
        if(selectedDate){
            const shop_id = getInfoFromLocal().user.shopId
            const formattedDate = (format(selectedDate, 'yyyy-MM-dd'));
            const data = {
                shopId: shop_id,
                date: formattedDate
            }
            await dispatch(attReport({ method: 'delete', data: data }))
            fetchData()
            setSelectedDate(null)
        }
        setShowAlert(false)
    }

    React.useEffect(()=>{
        if(attData){
            setPageCount(attData.meta.last_page);
        }
    },[attData])

    React.useEffect(()=>{
        fetchData()
    },[search])

    React.useEffect(()=>{
        fetchAttendenceBonus()
    },[])

    return (
        <Box sx={{
            bgcolor: theme.palette.common.white,
            borderRadius: '10px',
            height: '100%',
            pb: 3
        }}>
            {
                Attloading && <Loading></Loading>
            }
            <SalaryAdjustDialog open={diaOpen} setOpen={setDiaOpen}></SalaryAdjustDialog>
            <AttBonusEdit open={editDiaOpen} setOpen={setEditDiaOpen} oldData={oldData}></AttBonusEdit>
            <AlertDialog
                toggle={showAlert}
                setToggle={setShowAlert}
                cancel={handleCancel}
                confrim={handleConfirm}
                title={selectedDate ? "Are you sure?" : "Warning!"}
                content={selectedDate ? "You want to delete this attendance logs." : "You need to select the date that you want to delete attendance logs"}
            ></AlertDialog>
            <Typography variant='h6' align='center' sx={{ pt: 2}}>Today Employee Attendance</Typography>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 3,
                alignItems: 'center'
            }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button startIcon={<IsoIcon/>} onClick={()=> setDiaOpen(true) } variant='contained'>Penalty & Bonus</Button>
                    {
                        delLogOpen === true &&
                        <Box>
                            <DatePicker
                                showMonthYearPicker
                                isClearable
                                placeholderText="Select Month"
                                dateFormat={"MM-yyyy"}
                                className="customDatePicker"
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                            />
                        </Box>
                    }
                    <Button startIcon={<DeleteSweepIcon/>}
                        onClick={()=>{
                            if(delLogOpen === true){
                                handleDelete()
                                setDelLogOpen(false)
                            }else{
                                setDelLogOpen(true)
                            }
                        }}
                        variant='contained'
                    >{delLogOpen === true ? "Delete" : "Delete Att Log"}</Button>
                    <UploadAttFile></UploadAttFile>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                    <MonthFilter></MonthFilter>
                    <SearchInput></SearchInput>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Typography align='center' sx={{ mr: 2 }}>Attendance Bonus - {attendenceBonus ? attendenceBonus?.bonus : "0"} MMK</Typography>
                <IconButton sx={{ mr: 3 }} onClick={()=>{
                    setEditDiaOpen(true)
                    setOldData(attendenceBonus)
                }}>
                    <DriveFileRenameOutlineIcon color='primary'/>
                </IconButton>
            </Box>
            <TableContainer sx={{ px: 3 }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableHead>No</StyledTableHead>
                            <StyledTableHead>Date</StyledTableHead>
                            <StyledTableHead>Staff Name</StyledTableHead>
                            <StyledTableHead sx={{ textAlign: 'center' }}>Start</StyledTableHead>
                            <StyledTableHead sx={{ textAlign: 'center' }}>Leave</StyledTableHead>
                            <StyledTableHead sx={{ textAlign: 'center' }}>Note</StyledTableHead>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            attData && attData.data.length > 0 ?
                            attData.data.map((att, index) => (
                            <TableRow key={index}>
                                <StyledTableData>{((attData?.meta?.current_page - 1) * attData?.meta?.per_page)+(index + 1)}</StyledTableData>
                                <StyledTableData>{changeDate(att.date)}</StyledTableData>
                                <StyledTableData>{att.name}</StyledTableData>
                                <StyledTableData sx={{ textAlign: 'center' }}>{att.arrivedAt ? formatTime(att.arrivedAt) : '-'}</StyledTableData>
                                <StyledTableData sx={{ textAlign: 'center' }}>{att.leftAt ? formatTime(att.leftAt) : '-'}</StyledTableData>
                                <StyledTableData sx={{ textAlign: 'center', color: Number(att.absent) === 1 ? theme.palette.primary.main : theme.palette.dark.main }}>{Number(att.absent) === 0 ? '-' : 'Absent'}</StyledTableData>
                            </TableRow>
                            )):
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <NoDataAlert content={"There is no attendance reports"}></NoDataAlert>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <AppPagination pageCount={pageCount}/>
        </Box>
    )
}

export default Attendance