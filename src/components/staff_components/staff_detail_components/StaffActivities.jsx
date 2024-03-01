import { Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import * as React from "react";
import StyledTableHead from "../../utils/StyledTableHead";
import StyledTableData from "../../utils/StyledTableData";
import { useSelector } from "react-redux";
import { changeDateTime } from "../../../utils/changeDateTime";
import theme from "../../../utils/theme";
import NoDataAlert from "../../utils/NoDataAlert";

const StaffActivities = ({activities}) => {
    
    const staffDetail = useSelector(state=> state.Staff.staffDetail)

    return (
        <Box sx={{ mb: 5 }}>
            <Typography variant="subtitle">{staffDetail?.employee && staffDetail.employee.name}'s Activities</Typography>
            <TableContainer sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableHead align="center">No</StyledTableHead>
                            <StyledTableHead>Date</StyledTableHead>
                            <StyledTableHead>Item Or Service Name</StyledTableHead>
                            <StyledTableHead align="center">Status</StyledTableHead>
                            <StyledTableHead align="center">Price</StyledTableHead>
                            <StyledTableHead align="center">Quantity</StyledTableHead>
                            <StyledTableHead align="center">Commission</StyledTableHead>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            activities.length > 0 ?
                            activities.map((activity, index) => (
                            <TableRow key={index}>
                                <StyledTableData align="center">{index + 1}</StyledTableData>
                                <StyledTableData>{changeDateTime(activity.date)}</StyledTableData>
                                <StyledTableData>{activity.serviceName || activity.itemName}</StyledTableData>
                                <StyledTableData align="center">
                                    {
                                        activity.status ?
                                        activity.status === 'membership service' ?
                                        <Chip label="membership" size="small"></Chip>
                                        :
                                        <Chip label={activity.status} size="small" sx={activity.status === 'byname' ? { color: theme.palette.info.main } : {}}></Chip>
                                        :
                                        <Chip label="sale" size="small" sx={{ color: theme.palette.secondary.main }}></Chip>
                                    }
                                </StyledTableData>
                                <StyledTableData sx={{ textAlign: 'center', py:0 }}>{activity.price}</StyledTableData>
                                <StyledTableData sx={{ textAlign: 'center', py:0 }}>{activity.quantity}</StyledTableData>
                                <StyledTableData sx={{ textAlign: 'center', py: 0 }}>{activity.commission}</StyledTableData>
                            </TableRow>
                        ))
                        :
                        <TableRow>
                            <TableCell colSpan={7}>
                                <NoDataAlert content={"There is no records"}></NoDataAlert>
                            </TableCell>
                        </TableRow>
                    }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default StaffActivities