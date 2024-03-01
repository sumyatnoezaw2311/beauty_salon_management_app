import * as React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import StarIcon from '@mui/icons-material/Star';
import theme from '../../utils/theme';
import { TableCell, Typography } from '@mui/material';
import { formatCountNum } from '../../utils/formatCountNum';
import NoDataAlert from '../utils/NoDataAlert'

const FanListTable = ({ customers })=>{
    return (
        <Box sx={{
            p: 3,
            bgcolor: theme.palette.common.white,
            borderRadius: '10px',
            height: '100%'
        }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Typography sx={{ fontSize: { xs: '16px', sm: '18px', lg: '20px', xl: '22px'}, pr: '10px' }}>Top Fans in this Month</Typography>
                        <StarIcon sx={{ color: theme.palette.warning.main, fontSize: '30px' }} />
                        <StarIcon sx={{ color: theme.palette.warning.main, fontSize: '30px' }} />
                        <StarIcon sx={{ color: theme.palette.warning.main, fontSize: '30px' }} />
                    </Box>
                    <Link to={"/customers"} underline="hover">
                        <Typography sx={{ fontSize: { md: '12px', xl: '14px'} }} color='primary'>View all...</Typography>
                    </Link>
                </Box>
                <Table sx={{ mt: '20px' }} aria-label="custom pagination table">
                <TableBody>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }} align='center'>No</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                    </TableRow>
                    {
                        Object.keys(customers).length > 0 ?
                        Object.keys(customers).map((cus, index) => (
                        <TableRow key={index}>
                            <TableCell align='center'>
                                {index + 1}
                            </TableCell>
                            <TableCell>
                                {cus}
                            </TableCell>
                            <TableCell>
                                {formatCountNum(customers[cus]) || 0}
                            </TableCell>
                        </TableRow>
                        )):
                        <TableRow>
                            <TableCell colSpan={3}>
                                <NoDataAlert content={'There is no fans'}></NoDataAlert>
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>            
        </Box>
    );
}


export default FanListTable