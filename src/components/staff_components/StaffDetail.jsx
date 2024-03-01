import { Box, FormControl, InputLabel, MenuItem, Typography, Select, Button } from "@mui/material"
import DatePicker from "react-datepicker";
import theme from "../../utils/theme";
import StaffActivities from "./staff_detail_components/StaffActivities";
import MembershipAvailability from "./staff_detail_components/MembershipAvailability";
import { useDispatch, useSelector } from "react-redux";
import { getStaffDetail, staffTotalSaving } from "../../slices/staffSlice";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Loading from "../utils/Loading";

const StaffDetail = () => {

    const dispatch = useDispatch()
    const { id } = useParams()
    const { staffDetail: staffDetail, loading, totalSaving } = useSelector(state=> state.Staff )
    const [ activities,setActivities ] = useState([])
    const [ membershipRecs,setMembershipRecs ] = useState([])
    const [ selectedDate,setSelectedDate ] = useState(null)
    const [age, setAge] = useState('');
    const today = format(new Date(), 'yyyy-MM-dd')

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const fetchStaffDetail = async(date)=>{
        await dispatch(getStaffDetail({ method: 'get', id: id, date: date || today }))
    }

    const getTotalSaving = async()=>{
        await dispatch(staffTotalSaving({ method: 'get', data: null, id: id }))
    }

    useEffect(()=>{
        if(selectedDate){
            const formattedDate = format(selectedDate, 'yyyy-MM-dd')
            fetchStaffDetail(formattedDate)
        }else{
            fetchStaffDetail()
        }
    },[selectedDate])

    useEffect(()=>{
        if(staffDetail){
            setActivities([...staffDetail.membershipServiceRecords, ...staffDetail.saleRecords, ...staffDetail.serviceRecords ]);
            staffDetail.membershipRecords && setMembershipRecs(staffDetail.membershipRecords);
        }
    },[staffDetail])

    useEffect(()=>{
        fetchStaffDetail()
        getTotalSaving()
    },[])

    return (
            <Box sx={{
                bgcolor: theme.palette.common.white,
                borderRadius: '10px',
                height: '100%',
                p: 3
            }}>
                { loading && <Loading/> }
                <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>Daily Reports for "{staffDetail?.employee && staffDetail.employee.name}"</Typography>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    my: 3,
                    gap: 1
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <DatePicker placeholderText='Select Date' dateFormat={'dd-MM-yyyy'} className='customDatePicker' selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
                        <Button onClick={()=> setSelectedDate(null) } disabled={!selectedDate} sx={{ height: '100%', ml: 2 }} variant="contained">Today</Button>
                    </Box>
                    <Typography>Total Savings - {totalSaving || "0"} MMK</Typography>
                    <FormControl size="small" sx={{ width: 200 }}>
                        <InputLabel id="select-staff">Filter by status</InputLabel>
                        <Select
                            value={age}
                            onChange={handleChange}
                            label='Filter by status'
                            displayEmpty
                        >
                            <MenuItem value={1}>Normal</MenuItem>
                            <MenuItem value={2}>By Name</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <StaffActivities activities={activities} />
                <MembershipAvailability memberships={membershipRecs} />
            </Box>
    )
}

export default StaffDetail