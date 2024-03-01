import { Box, IconButton, Table, TableBody, TableHead, TableRow, Typography } from "@mui/material"
import theme from "../../utils/theme";
import StyledTableData from "../utils/StyledTableData";
import StyledTableHead from "../utils/StyledTableHead";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AdminLayout from "../layouts/AdminLayout";

const StockDetail = () => {

    const stockList = [
        {
            date: '12-1-2023',
            staffName: 'Ma Qing Qing',
            quantity: 5,
            totalFee: 4000
        },
        {
            date: '12-1-2023',
            staffName: 'Maki Zen',
            quantity: 5,
            totalFee: 25000
        },
        {
            date: '12-1-2023',
            staffName: 'Zenitsu',
            quantity: 5,
            totalFee: 5000
        },
    ]

    const total = stockList.reduce((acc, item) => acc + item.quantity, 0);
    return (
        <AdminLayout>
            <Box sx={{
                bgcolor: theme.palette.common.white,
                borderRadius: '10px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                height: '100%'
            }}>
                <Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: '30px'
                    }}>
                        <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>Item Name - Shampoo</Typography>
                        <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>Total Quantity - {total}</Typography>
                    </Box>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableHead>#</StyledTableHead>
                                <StyledTableHead>Date</StyledTableHead>
                                <StyledTableHead sx={{ textAlign: 'center' }}>Staff Name</StyledTableHead>
                                <StyledTableHead sx={{ textAlign: 'center' }}>Quantity</StyledTableHead>
                                <StyledTableHead sx={{ textAlign: 'center' }}>Actions</StyledTableHead>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stockList.map((stock, index) => (
                                <TableRow key={index}>
                                    <StyledTableData>{index + 1}</StyledTableData>
                                    <StyledTableData>{stock.date}</StyledTableData>
                                    <StyledTableData sx={{ textAlign: 'center' }}>{stock.staffName}</StyledTableData>
                                    <StyledTableData sx={{ textAlign: 'center' }}>{stock.quantity}</StyledTableData>
                                    <StyledTableData sx={{ textAlign: 'center' }}>
                                        <IconButton>
                                            <DeleteOutlineIcon sx={{ color: theme.palette.primary.main }} />
                                        </IconButton>
                                    </StyledTableData>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Box>
        </AdminLayout>
    )
}

export default StockDetail