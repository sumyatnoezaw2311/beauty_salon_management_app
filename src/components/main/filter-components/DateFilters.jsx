import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import DatePicker from "react-datepicker";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const DateFilters = () => {
  const navigate = useNavigate()
  const [ startDate,setStartDate ] = useState(null)
  const [ endDate,setEndDate ] = useState(null)

  const todayFilter = ()=>{
    setStartDate(null)
    setEndDate(null)
    const today = new Date()
    const nextDay = new Date();
    nextDay.setDate(today.getDate() + 1);
    const todayFormatted = format(today, 'yyyy-MM-dd');
    const nextDayFormatted = format(nextDay, 'yyyy-MM-dd');
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('start_date', todayFormatted);
    searchParams.set('end_date', nextDayFormatted);
    navigate(`?${searchParams.toString()}`);
  }

  useEffect(()=>{
    if(startDate && endDate){
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('start_date', format(new Date(startDate), "yyyy-MM-dd"));
      searchParams.set('end_date', format(new Date(endDate), "yyyy-MM-dd"));
      navigate(`?${searchParams.toString()}`);
    }else if(!startDate && !endDate){
      navigate("?page=1")
    }
  },[startDate,endDate])

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
    }}>
      <Button onClick={()=> todayFilter() } sx={{ height: '100%', mr: 2 }} variant='outlined'>
        Today
      </Button>
      <DatePicker isClearable placeholderText='Start Date' dateFormat={'dd-MM-yyyy'} className='customDatePicker' selected={startDate} onChange={(date) => setStartDate(date)}/>
      <Box sx={{ width: 1 }}></Box>
      <DatePicker isClearable placeholderText='End Date' dateFormat={'dd-MM-yyyy'} className='customDatePicker' selected={endDate} onChange={(date) => setEndDate(date)} />
    </Box>
  );
};

export default DateFilters;
