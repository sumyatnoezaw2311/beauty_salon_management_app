import React, { useState,useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import DriveFileRenameOutline from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from '@mui/icons-material/Delete';
import DetailsIcon from "@mui/icons-material/Details";
import HistoryIcon from "@mui/icons-material/History";
import AppPagination from "../components/main/filter-components/AppPagination";
import SearchInput from "../components/main/filter-components/SearchInput";
import StyledTableHead from "../components/utils/StyledTableHead";
import StyledTableData from "../components/utils/StyledTableData";
import { useDispatch, useSelector } from "react-redux";
import { getAllStaff, staffCud } from "../slices/staffSlice";
import theme from "../utils/theme";
import CreateNewStaff from "../components/staff_components/CreateNewStaff";
import UpdateStaff from "../components/staff_components/UpdateStaff";
import NoDataAlert from "../components/utils/NoDataAlert";
import { changeDateTime } from "../utils/changeDateTime";
import Loading from "../components/utils/Loading";
import AlertDialog from "../components/utils/AlertDialog";

const StaffList = () => {
  const [ showAlert,setShowAlert ] = useState(false)
  const [ idToDel,setIdToDel ] = useState(null)
  const dispatch = useDispatch();
  const { search } = useLocation()
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const { staffs: staffList, loading } = useSelector((state) => state.Staff);
  const [staffData, setStaffData] = useState(null);

  const fetchData = async () => {
    await dispatch(getAllStaff({ method: "get", data: null }));
  };

  const handleDelete = async (id)=>{
    setShowAlert(true)
    setIdToDel(id)
  }

  const handleCancel = ()=>{
      setShowAlert(false)
      setIdToDel(null)
  }

  const handleConfirm = async ()=>{
      await dispatch(staffCud({ method: "delete", data: null, id: idToDel }));
      setShowAlert(false)
      setIdToDel(null)
      fetchData();
  }

  useEffect(() => {
    fetchData();
  }, [search]);

  return (
    <Box
      sx={{
        bgcolor: theme.palette.common.white,
        borderRadius: "10px",
        height: "100%",
        pb: 3
      }}
    >
      { loading && <Loading/> }
      <AlertDialog
        toggle={showAlert}
        setToggle={setShowAlert}
        cancel={handleCancel}
        confrim={handleConfirm}
        title={"Are you sure?"}
        content={"You want to delete this staff."}
      ></AlertDialog>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
          }}
        >
          <UpdateStaff
            open={editOpen}
            setOpen={setEditOpen}
            oldData={staffData}
          ></UpdateStaff>
          <CreateNewStaff open={open} setOpen={setOpen}></CreateNewStaff>
          <Button onClick={() => setOpen(true)} variant="contained" sx={{ height: '100%' }}>
            Add New
          </Button>
        </Box>
        <SearchInput placeholderText={"Search by staff name"}></SearchInput>
      </Box>
      <TableContainer sx={{ px: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <StyledTableHead align="center">No</StyledTableHead>
              <StyledTableHead>Name</StyledTableHead>
              <StyledTableHead>Phone Number</StyledTableHead>
              <StyledTableHead>NRC No</StyledTableHead>
              <StyledTableHead>Address</StyledTableHead>
              <StyledTableHead>Father's Name</StyledTableHead>
              <StyledTableHead>Basic Salary</StyledTableHead>
              <StyledTableHead>Saving</StyledTableHead>
              <StyledTableHead sx={{ textAlign: "center" }}>
                Actions
              </StyledTableHead>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffList && staffList.data.length > 0 ? (
              staffList.data.map((staff, index) => (
                <TableRow key={index}>
                  <StyledTableData align="center">{((staffList?.meta?.current_page - 1) * staffList?.meta?.per_page)+(index + 1)}</StyledTableData>
                  <StyledTableData>{staff.name}</StyledTableData>
                  <StyledTableData>{staff.phone}</StyledTableData>
                  <StyledTableData>{staff.nrc}</StyledTableData>
                  {!staff.deletedAt && (
                    <>
                      <StyledTableData>{staff.address}</StyledTableData>
                      <StyledTableData>{staff.father}</StyledTableData>
                      <StyledTableData>{staff.basicSalary}</StyledTableData>
                      <StyledTableData>{staff.saving}</StyledTableData>
                    </>
                  )}
                  {
                    staff.deletedAt ?
                    <>
                    <TableCell colSpan={3}>
                        <Typography sx={{ fontSize: { sm: '12px', xl: '14px' }, color: theme.palette.primary.main }}>{`${staff.name} quit the job at ${changeDateTime(staff.deletedAt)}.`}</Typography>
                    </TableCell>
                    <StyledTableData>
                        <IconButton>
                            <Tooltip title={"Activate"}>
                                <HistoryIcon sx={{ color: theme.palette.primary.main}}></HistoryIcon>
                            </Tooltip>
                        </IconButton>
                    </StyledTableData>
                    </>
                    :
                    <StyledTableData sx={{ whiteSpace: 'nowrap' }}>
                        <Link to={`/staff/staff-detail/${staff.id}`}>
                            <Tooltip title={"see more"}>
                                <IconButton sx={{ mr: 2 }}>
                                    <DetailsIcon
                                    sx={{ color: theme.palette.common.purple }}
                                    />
                                </IconButton>
                            </Tooltip>
                        </Link>
                        <Tooltip title={"Edit"}>
                            <IconButton
                                sx={{ mr: 2 }}
                                onClick={() => {
                                    setEditOpen(true);
                                    setStaffData(staff);
                                }}
                            >
                            <DriveFileRenameOutline
                                sx={{ color: theme.palette.warning.main }}
                            />
                            </IconButton>
                        </Tooltip>
                        <IconButton onClick={()=> handleDelete(staff.id)}>
                            <Tooltip title={"Deactivate"}>
                                <DeleteIcon
                                    sx={{ color: theme.palette.primary.main }}
                                />
                            </Tooltip>
                        </IconButton>
                    </StyledTableData>
                  }
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9}>
                  <NoDataAlert content={"There is no staffs"}></NoDataAlert>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <AppPagination pageCount={staffList?.meta?.last_page}/>
    </Box>
  );
};

export default StaffList;
