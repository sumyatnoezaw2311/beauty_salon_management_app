import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, alpha } from "@mui/material"
import theme from "../utils/theme"
import AppPagination from "../components/main/filter-components/AppPagination"
import NoDataAlert from "../components/utils/NoDataAlert"
import StyledTableData from "../components/utils/StyledTableData";
import { useEffect } from "react";
import DateFilters from "../components/main/filter-components/DateFilters";
import { useDispatch, useSelector } from "react-redux";
import { getReport } from "../slices/reportSlice";
import { changeDate } from '../utils/changeDateTime'
import { useLocation } from "react-router-dom";
import Loading from "../components/utils/Loading";

const Report = () => {
    
    const dispatch = useDispatch()
    const { search } = useLocation()
    const { reports: reportList, loading } = useSelector(state=> state.Report)

    const fetchData = async()=>{
        await dispatch(getReport({ method: 'get', data: null }))
    }

    useEffect(()=>{
        fetchData()
    },[search])

    return (
        <Box sx={{
            bgcolor: theme.palette.common.white,
            borderRadius: '10px',
            height: '100%'
        }}>
            { loading && <Loading/> }
            <Box sx={{
                display: 'flex',
                justifyContent: 'end',
                p: 3
            }}>
                <DateFilters></DateFilters>
            </Box>
                <TableContainer sx={{ px: 3 }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={10} align="center" sx={{ fontWeight: 'bold', py:  1 , fontSize: '16px', backgroundColor: alpha(theme.palette.common.black, 0.05) }}>ဝင်ငွေ</TableCell>
                                <TableCell colSpan={3} align="center" sx={{ fontWeight: 'bold', py:  1 , fontSize: '16px', backgroundColor: alpha(theme.palette.common.black, 0.08) }}>ထွက်ငွေ</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ p: 1, backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>No</TableCell>
                                <TableCell sx={{ p: 1, backgroundColor: alpha(theme.palette.primary.main, 0.1), whiteSpace: 'nowrap' }}>Date</TableCell>
                                <TableCell sx={{ p: 1, backgroundColor: alpha(theme.palette.primary.main, 0.1) }} align="center">Sale & Service</TableCell>
                                <TableCell sx={{ p: 1, backgroundColor: alpha(theme.palette.primary.main, 0.1) }} align="center">Membership</TableCell>
                                <TableCell sx={{ p: 1, backgroundColor: alpha(theme.palette.primary.main, 0.1) }} align="center">Additional Cost</TableCell>
                                <TableCell sx={{ p: 1, backgroundColor: alpha(theme.palette.primary.main, 0.1) }} align="center">Tax</TableCell>
                                <TableCell sx={{ p: 1, backgroundColor: alpha(theme.palette.primary.main, 0.2), fontWeight: 'bold' }} align="center">Total</TableCell>
                                <TableCell sx={{ p: 1, backgroundColor: alpha(theme.palette.secondary.main, 0.1) }} align="center">Kpay</TableCell>
                                <TableCell sx={{ p: 1, backgroundColor: alpha(theme.palette.secondary.main, 0.1) }} align="center">Cash</TableCell>
                                <TableCell sx={{ p: 1, backgroundColor: alpha(theme.palette.secondary.main, 0.3), fontWeight: 'bold' }} align="center">Total</TableCell>
                                <TableCell sx={{ p: 1, backgroundColor: alpha(theme.palette.info.main, 0.1) }} align="center">Purchase</TableCell>
                                <TableCell sx={{ p: 1, backgroundColor: alpha(theme.palette.info.main, 0.1) }} align="center">Expense</TableCell>
                                <TableCell sx={{ p: 1, backgroundColor: alpha(theme.palette.info.main, 0.1) }} align="center">Salary Advance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                (reportList && reportList.data && reportList.data?.length > 0 ) ?
                                reportList?.data.map((report, index) => (
                                <TableRow key={index}>
                                    <StyledTableData sx={{ px: 1 }} align="center">{reportList.meta ? ((reportList.meta?.current_page - 1) * reportList.meta?.per_page)+(index + 1) : index + 1}</StyledTableData>
                                    <StyledTableData sx={{ px: 1 }}>{changeDate(report.date)}</StyledTableData>
                                    <StyledTableData sx={{ px: 1 }} align="center">{report.saleServiceIncome}</StyledTableData>
                                    <StyledTableData sx={{ px: 1 }} align="center">{report.membershipIncome}</StyledTableData>
                                    <StyledTableData sx={{ px: 1 }} align="center">{report.additionalCostIncome}</StyledTableData>
                                    <StyledTableData sx={{ px: 1 }} align="center">{report.taxIncome}</StyledTableData>
                                    <StyledTableData sx={{ px: 1 }} align="center">{Number(report.saleServiceIncome) + Number(report.membershipIncome) + Number(report.additionalCostIncome) + Number(report.taxIncome)}</StyledTableData>
                                    <StyledTableData sx={{ px: 1 }} align="center">{report.kpayIncome}</StyledTableData>
                                    <StyledTableData sx={{ px: 1 }} align="center">{report.cashIncome}</StyledTableData>
                                    <StyledTableData sx={{ px: 1 }} align="center">{Number(report.kpayIncome) + Number(report.cashIncome)}</StyledTableData>
                                    <StyledTableData sx={{ px: 1 }} align="center">{report.purchase}</StyledTableData>
                                    <StyledTableData sx={{ px: 1 }} align="center">{report.expense}</StyledTableData>
                                    <StyledTableData sx={{ px: 1 }} align="center">{report.salaryAdvance}</StyledTableData>
                                </TableRow>
                            )):
                            <TableRow>
                                <TableCell colSpan={13}>
                                    <NoDataAlert content={"There is no reports"}></NoDataAlert>
                                </TableCell>
                            </TableRow>
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
            <AppPagination pageCount={reportList?.meta?.last_page}/>
        </Box>
    )
}

export default Report