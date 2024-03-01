import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from "@mui/material"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getAllStaff } from '../../../slices/staffSlice';
import { useDispatch, useSelector } from 'react-redux';
import AsyncAutoComplete from '../../utils/AsyncAutoComplete';
import { getAllItem } from '../../../slices/itemSlice';
import { nanoid } from '@reduxjs/toolkit';
import { collectSale } from '../../../slices/receiptSlice';

const itemSchema = yup.object().shape({
    item: yup.object().nullable().required('Please Select Item Name!'),
    staff: yup.object().nullable().required('Please Select Staff Name!'),
    quantity: yup.number().required('Please Add Quantity!').typeError('Your Quantity is Wrong!')
})

const AddItem = () => {

    const dispatch = useDispatch()
    const staffs = useSelector(state=> state.Staff.staffs)
    const staffsLoading = useSelector(state=> state.Staff.loading)
    const items = useSelector(state=> state.Item.items)
    const itemsLoading = useSelector(state=> state.Item.loading)
    const [ searchTextItem,setSearchTextItem ] = React.useState("")
    const [ searchTextStaff,setSearchTextStaff ] = React.useState("")
    const [staff, setStaff] = useState(null)
    const [item, setItem] = useState(null)
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

    const fetchStaff = async ()=>{
        await dispatch(getAllStaff({ method: 'get', data: null, keyword: searchTextStaff }))
    }

    const fetchItem = async ()=>{
        await dispatch(getAllItem({ method: 'get', data: null, keyword: searchTextStaff }))
    }

    const handleAddMember = async (data) => {
        const newData = {
            ...data,
            id: nanoid()
        }
        await dispatch(collectSale(newData))
        reset()
        setItem(null)
        setStaff(null)
    }

    useEffect(()=>{
        if(staff){
            setValue('staff', staff)
            trigger('staff')
        }
    },[staff])

    useEffect(()=>{
        fetchStaff()
    },[searchTextStaff])

    useEffect(()=>{
        if(item){
            setValue('item', item)
            trigger('item')
        }
    },[item])

    useEffect(()=>{
        fetchItem()
    },[searchTextItem])

    return (
        <Box sx={{ py: 3 }}>
            <form autoComplete='off' onSubmit={handleSubmit(handleAddMember)}>
                <Typography variant='h6' sx={{ pb: 3 }} >Add Item</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 3, width: '100%', gap: 2 }}>
                    <Box sx={{ width: 300 }}>
                        <AsyncAutoComplete setSearchText={setSearchTextItem} selectedOption={item} setSelectedOption={setItem} options={items?.data || []} placeholder={'Select Item'} error={errors?.item} loading={itemsLoading}/>
                    </Box>
                    <Box sx={{ width: 300 }}>
                        <AsyncAutoComplete setSearchText={setSearchTextStaff} selectedOption={staff} setSelectedOption={setStaff} options={staffs?.data || []} placeholder={'Select Staff'} error={errors?.staff} loading={staffsLoading}/>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                    <TextField
                        {...register('quantity')}
                        error={!!errors?.quantity}
                        helperText={errors?.quantity?.message}
                        sx={{ width: 300 }}
                        placeholder="Quantity"
                    />
                    <Box sx={{ width: 300, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type='submit' variant="contained">Add</Button>
                    </Box>
                </Box>
            </form>
        </Box>
    )
}

export default AddItem