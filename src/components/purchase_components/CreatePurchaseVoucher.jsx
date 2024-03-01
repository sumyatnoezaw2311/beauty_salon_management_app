import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, FormControlLabel, FormGroup, IconButton, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, alpha } from "@mui/material"
import theme from "../../utils/theme";
import StyledTableData from '../utils/StyledTableData';
import StyledTableHead from '../utils/StyledTableHead';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CheckIcon from '@mui/icons-material/Check';
import AsyncAutoComplete from '../utils/AsyncAutoComplete'
import { useDispatch, useSelector } from 'react-redux';
import { getAllItem } from '../../slices/itemSlice';
import { collectItem, receiptCud, removeItem, resetItem } from '../../slices/receiptSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import { nanoid } from '@reduxjs/toolkit';
import { shopId } from '../../utils/config';
import { useNavigate } from 'react-router-dom';

const itemSchema = yup.object().shape({
    item: yup.object().nullable().required('Please Select Item Name!'),
    quantity: yup.number().required('Please Add Quantity!').typeError('Your Quantity is Wrong!')
})

const CreatePurchaseVoucher = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const items = useSelector(state=> state.Item.items)
    const collectedItems = useSelector(state=> state.Receipt.collectedItems)
    const [ totalPrice,setTotalPrice ] = useState(0)
    const [ searchText,setSearchText ] = React.useState("")
    const [ item, setItem ] = React.useState(null);
    const [ addToStock, setAddToStock ] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        trigger,
    } = useForm({
        resolver: yupResolver(itemSchema),
    });
    const fetchItems = async ()=>{
        await dispatch(getAllItem({ method: 'get', data: null, keyword: searchText }))
    }

    const handleAddPurchaseItem = (data) => {
        const newData = {
            ...data, id: nanoid()
        }
        dispatch(collectItem(newData))
        reset()
        setItem(null)
    }

    const handleRemoveItem = (id)=>{
        dispatch(removeItem(id))
    }

    const handleCreate = async ()=>{
        if(!(collectedItems.length > 0)) return;
        const createData = {
            price: totalPrice,
            shopId: shopId(),
            addToStock: addToStock,
            items: collectedItems.map(collectItem=>{
                return {
                id: collectItem.item.id,
                quantity: collectItem.quantity,
                price: Number(collectItem.item.purchasePrice)
            }})
        }
        await dispatch(receiptCud({ method: 'post', data: createData, type: 'purchase' }))
        dispatch(resetItem())
        navigate('/purchases')
    }

    React.useEffect(()=>{
        fetchItems()
    },[searchText])

    useEffect(()=>{
        const total = collectedItems.reduce((acc, item) => acc + (item.item.purchasePrice * item.quantity), 0);
        setTotalPrice(total)
    },[collectedItems])

    React.useEffect(()=>{
        if(item){
            setValue('item', item)
            trigger('item')
        }else{
            setValue('item', null)
        }
    },[item])

    useEffect(()=>{
        fetchItems()
    },[])


    return (
        <Box sx={{
            bgcolor: theme.palette.common.white,
            borderRadius: '10px',
            p: 5,
            height: '100%'
        }}>
            <Typography sx={{ fontWeight: 'bold', mb: 3 }} variant='h6'>Add Item</Typography>

            {/* add section */}
            <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                <Box sx={{ width: '50%' }}>
                    <form autoComplete='off' onSubmit={handleSubmit(handleAddPurchaseItem)}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                gap: 2
                            }}>
                                <Box sx={{ width: 300 }}>
                                    <AsyncAutoComplete setSearchText={setSearchText} selectedOption={item} setSelectedOption={setItem} options={items?.data || []} placeholder={'Select Items'} error={errors?.item}/>
                                </Box>
                                <TextField
                                    {...register('quantity')}
                                    error={!!errors?.quantity}
                                    helperText={errors?.quantity?.message}
                                    sx={{
                                        width: '300px',
                                    }}
                                    placeholder="Quantity"
                                />
                            </Box>
                            <Button variant='text' sx={{ color: theme.palette.dark.main, ml: 5, mr: 3 }}>Cancel</Button>
                            <Button type='submit' variant='contained'>Add</Button>
                        </Box>
                    </form>
                </Box>
            </Box>
            <Table sx={{ mt: 5 }}>
                <TableHead>
                    <TableRow>
                        <StyledTableHead align='center'>No</StyledTableHead>
                        <StyledTableHead>Item Name</StyledTableHead>
                        <StyledTableHead align='center'>Price</StyledTableHead>
                        <StyledTableHead align='center'>Quantity</StyledTableHead>
                        <StyledTableHead align='center'>Total</StyledTableHead>
                        <StyledTableHead></StyledTableHead>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { collectedItems.map((item, index) => (
                        <TableRow key={index}>
                            <StyledTableData align='center'>{index + 1}</StyledTableData>
                            <StyledTableData>{item.item.name}</StyledTableData>
                            <StyledTableData align='center'>{item.item.purchasePrice}</StyledTableData>
                            <StyledTableData align='center'>{item.quantity}</StyledTableData>
                            <StyledTableData align='center'>{item.quantity * item.item.purchasePrice}</StyledTableData>
                            <StyledTableData align='center'>
                                <IconButton onClick={()=> handleRemoveItem(item.id)}>
                                    <DeleteIcon sx={{ color: theme.palette.primary.main }} />
                                </IconButton>
                            </StyledTableData>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell sx={{ bgcolor: alpha(theme.palette.dark.main, 0.1)}} colSpan={3}></TableCell>
                        <TableCell sx={{ bgcolor: alpha(theme.palette.dark.main, 0.1), fontSize: '18px' }} align='center'>Total Price</TableCell>
                        <TableCell sx={{ bgcolor: alpha(theme.palette.dark.main, 0.1), fontSize: '18px' }} align='center'>{totalPrice}</TableCell>
                        <TableCell sx={{ bgcolor: alpha(theme.palette.dark.main, 0.1)}}></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' , mt: 3 }}>
                <FormGroup>
                    <FormControlLabel control={
                        <Switch
                            checked={addToStock}
                            onChange={(e)=> setAddToStock(e.target.checked) }
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    } label="Add To Stock" />
                </FormGroup>
                <Button disabled={!(collectedItems.length > 0)} onClick={()=> handleCreate() } sx={{ ml: 3 }} variant="contained" startIcon={<CheckIcon />}>Save</Button>
            </Box>
        </Box>
    )
}

export default CreatePurchaseVoucher