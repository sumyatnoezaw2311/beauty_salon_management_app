import React , { useEffect, useState } from "react";
import { Box, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import theme from "../../utils/theme";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import StyledTableHead from "../../components/utils/StyledTableHead";
import StyledTableData from "../../components/utils/StyledTableData";
import SaveIcon from '@mui/icons-material/Save';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import { categoryCud, getAllCategory } from "../../slices/itemSlice";
import NoDataAlert from "../utils/NoDataAlert";
import { useNavigate } from "react-router-dom";
import Loading from "../utils/Loading";
import AlertDialog from "../utils/AlertDialog";

const createCategorySchema = yup.object().shape({
    name: yup.string().required('Please add Category Name!'),
});

const CategoriesList = () => {
    const [ showAlert,setShowAlert ] = useState(false)
    const [ idToDel,setIdToDel ] = useState(null)
    const navigate = useNavigate()
    const [ edit,setEdit ] = useState(false)
    const [ idToEdit,setIdToEdit ] = useState(null)
    const { categories: categoryList, loading } = useSelector(state=> state.Item)
    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm({
        resolver: yupResolver(createCategorySchema)
    });

    const fetchData = async()=>{
        await dispatch(getAllCategory({ method: 'get', data: null }))
    }

    const handleAddCategory = async (data) => {
        if(edit){
            await dispatch(categoryCud({ method: 'put', data: data, id: idToEdit }))
            setIdToEdit(null)
            setEdit(false)
        }else{
            await dispatch(categoryCud({ method: 'post', data: data, id: null }))
        }
        fetchData()
        reset()
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
        await dispatch(categoryCud({ method: 'delete', data: null, id: idToDel }))
        setShowAlert(false)
        setIdToDel(null)
        fetchData();
    }

    const handleUpdate = async (cat)=>{
        setValue('name', cat.name)
        setIdToEdit(cat.id)
        setEdit(true)
    }

    useEffect(() => {
        navigate("");
        fetchData();
    },[]);

    return (
        <Grid container spacing={3} sx={{ mt: 1, width: 500, px: 3 }}>
            {
                loading && <Loading/>
            }
            <AlertDialog
                toggle={showAlert}
                setToggle={setShowAlert}
                cancel={handleCancel}
                confrim={handleConfirm}
                title={"Are you sure?"}
                content={"You want to delete this category."}
            ></AlertDialog>
            <Grid item xs={12} md={12}>
                <form autoComplete='off' onSubmit={handleSubmit(handleAddCategory)}>
                    <Box sx={{
                        p: 2
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Typography variant="subtitle1">Add New Category</Typography>
                            <IconButton type="submit">
                                <SaveIcon sx={{ color: '#D14D72'}}/>
                            </IconButton>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: 'fit-content'
                        }}>
                            <TextField
                                {...register('name')}
                                error={!!errors?.name}
                                placeholder='Category Name'
                                helperText={errors?.name?.message}
                                // size="small"
                                sx={{ my: 1 }}
                            />
                        </Box>
                    </Box>
                </form>
            </Grid>
            <Grid item xs={12} md={12}>
               <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableHead align="center">No</StyledTableHead>
                                <StyledTableHead>Name</StyledTableHead>
                                <StyledTableHead align="center">Action</StyledTableHead>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                (categoryList && categoryList.data.length > 0 ) ?
                                [...categoryList.data].reverse().map((cat,index)=>
                                    <TableRow key={index}>
                                        <StyledTableData align="center">{index+1}</StyledTableData>
                                        <StyledTableData>{cat.name}</StyledTableData>
                                        <StyledTableData align="center">
                                            <Tooltip title={'Edit'}>
                                                <IconButton onClick={()=> handleUpdate(cat) } sx={{ mr: 2 }}>
                                                    <BorderColorIcon sx={{ color: theme.palette.warning.main }} />
                                                </IconButton>
                                            </Tooltip>                                            
                                            <Tooltip title={'Delete'}>
                                                <IconButton onClick={()=> handleDelete(cat.id)}>
                                                    <DeleteIcon sx={{ color: theme.palette.primary.main }} />
                                                </IconButton>
                                            </Tooltip>                                            
                                        </StyledTableData>
                                    </TableRow>
                                ):
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <NoDataAlert content={"There is no category names"}></NoDataAlert>
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
               </TableContainer>
            </Grid>
        </Grid>
    );
};

export default CategoriesList;
