import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import StyledTableData from "../../utils/StyledTableData"
import StyledTableHead from "../../utils/StyledTableHead"
import { useSelector } from "react-redux"
import { changeDateTime } from "../../../utils/changeDateTime"
import NoDataAlert from "../../utils/NoDataAlert"


const MembershipAvailability = ({memberships}) => {

    const staffDetail = useSelector(state=> state.Staff.staffDetail)

    return (
        <Box sx={{
            width: '100%'
        }}>
            <Typography variant="subtitle">{staffDetail?.employee && staffDetail.employee.name}'s Membership Availability</Typography>
            <TableContainer>
                <Table sx={{ my: 3 }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableHead>No</StyledTableHead>
                            <StyledTableHead>Date</StyledTableHead>
                            <StyledTableHead>Service Name</StyledTableHead>
                            <StyledTableHead align="center">Price</StyledTableHead>
                            <StyledTableHead align="center">Commission</StyledTableHead>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            memberships.length > 0 ?
                            memberships.map((membership, index) => (
                            <TableRow key={index}>
                                <StyledTableData>{index + 1}</StyledTableData>
                                <StyledTableData>{changeDateTime(membership.date)}</StyledTableData>
                                <StyledTableData>{membership.serviceName}</StyledTableData>
                                <StyledTableData align="center">{membership.price}</StyledTableData>
                                <StyledTableData align="center">{membership.commission}</StyledTableData>
                            </TableRow>
                        ))
                        :
                        <TableRow>
                            <TableCell colSpan={5}>
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

export default MembershipAvailability