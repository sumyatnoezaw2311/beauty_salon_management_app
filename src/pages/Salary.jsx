import React,{ Fragment, useEffect, useRef, useState} from "react";
import PrintIcon from '@mui/icons-material/Print';
import { Box, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"
import theme from "../utils/theme";
import { useDispatch, useSelector } from "react-redux";
import { changeMonthFromat } from '../utils/changeDateTime'
import { getAllSalaries } from "../slices/salarySlice";
import NoDataAlert from "../components/utils/NoDataAlert";
import { useReactToPrint } from 'react-to-print';
import { format } from "date-fns";
import MonthFilter from "../components/main/filter-components/MonthFilter";
import { useLocation } from "react-router-dom";
import Loading from '../components/utils/Loading'

const headers = ["Date", "Name", "Salary", "Byname", "Normal", "Sale", "Membership", "Commission", "ကြိုသုံး", "စုကြေး","ဒဏ်ကြေး","Total" ]

const Salary = () => {
    const { search } = useLocation()
    const dispatch = useDispatch()
    const printRef = useRef()
    const [ monthYear,setMonthYear ] = useState(null)
    const [ printScreen,setPrintScreen ] = useState(false)
    const { salaries: salaryList, loading } = useSelector(state=> state.Salary)

    const handlePrint = useReactToPrint({
        content: ()=> printRef.current,
        documentTitle: `salaries_list_${Date.now()}`,
        documentTitle: Date.now(),
        onAfterPrint: ()=> setPrintScreen(false)
    })

    const fetchSalary = async ()=>{
        await dispatch(getAllSalaries({ method: 'get', data: null }))
    }

    useEffect(()=>{
        const searchParams = new URLSearchParams(window.location.search);
        const date = searchParams.get('date');
        if(date){
            const formattedDate = format(new Date(date), 'MMM yyyy')
            setMonthYear(formattedDate)
        }else{
            setMonthYear(null)
        }
        fetchSalary()
    },[search])

    return (
      <Box
        sx={{
          bgcolor: theme.palette.common.white,
          borderRadius: "10px",
          minHeight: "100%",
        }}
      >
        {
            loading && <Loading></Loading>
        }
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
            <IconButton color="info" onClick={ async()=>{
                await setPrintScreen(true)
                handlePrint()
            }}>
                <PrintIcon sx={{ fontSize: '30px' }}></PrintIcon>
            </IconButton>
            <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}
            >
                <MonthFilter></MonthFilter>
            </Box>
        </Box>
        <Typography
            variant="h6"
            sx={{
                mb: 3,
                textAlign: 'center',
                fontWeight: 'bold',
            }}
        >{monthYear || format(new Date(), 'MMM yyyy') } Salary List</Typography>
        <Box
            ref={printRef}
            sx={{
                width: { xs: '100%', lg: '100%' },
                height: '100%',
                p: 2,
                '@media print': {
                    width: { xs: '210mm', lg: '210mm' },
                    '@page': { size: 'landscape', margin: '25px 20px', }
                },
            }}>
                {salaryList && salaryList.data && salaryList.data.length > 0 ? (
                    salaryList.data.map((salary, index) => (
                    <Box key={index} sx={{ overflowX: printScreen ? '' : 'auto' }}>
                        {
                            (index % 10 === 0 && index !== 0) && 
                            <Box sx={{ '@media print': { pageBreakBefore: 'always' } }} />
                        }
                        <Table>
                                <TableBody>
                                    <TableRow>
                                    {
                                        [index+1, ...headers].map((header, i) => (
                                            <TableCell
                                                align="center"
                                                key={i}
                                                sx={{
                                                    border: "none",
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    minWidth: i !== 0 ? '120px' : '',
                                                    px: 1,
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {header}
                                            </TableCell>
                                        ))
                                    }
                                    </TableRow>
                                    <TableRow key={index}>
                                        <TableCell align="center" ></TableCell>
                                        <TableCell align="center" sx={{ fontSize: '14px', px: 1, pb: 2, pt: '5px' }}>
                                        {changeMonthFromat(salary.date)}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '14px', px: 1, pb: 2, pt: '5px' }}>{salary.name}</TableCell>
                                        <TableCell align="center" sx={{ fontSize: '14px', px: 1, pb: 2, pt: '5px' }}>
                                        {salary.basicSalary}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '14px', px: 1, pb: 2, pt: '5px' }}>
                                        {salary.bynameServiceTime}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '14px', px: 1, pb: 2, pt: '5px' }}>
                                        {salary.normal_service_time}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '14px', px: 1, pb: 2, pt: '5px' }}>
                                        {salary.sale_time}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '14px', px: 1, pb: 2, pt: '5px' }}>
                                        {salary.membership_time}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '14px', px: 1, pb: 2, pt: '5px' }}>
                                        {salary.commission}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '14px', px: 1, pb: 2, pt: '5px' }}>
                                        {salary.salary_advance}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '14px', px: 1, pb: 2, pt: '5px' }}>
                                        {salary.saving}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '14px', px: 1, pb: 2, pt: '5px' }}>
                                        {salary.penaltyFee}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: "14px", px: 1, pb: 2, pt: '5px' }}>{salary.total}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                    </Box>
                ))
                ) : (
                <Box sx={{ px: 3 }}>
                    <NoDataAlert content={"There is no salary records!"}></NoDataAlert>
                </Box>
                )}
        </Box>
      </Box>
    );
}

export default Salary