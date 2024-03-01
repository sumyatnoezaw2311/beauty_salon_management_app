import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup, Switch, TextField, Typography } from "@mui/material"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import theme from '../../../utils/theme';
import AsyncAutoComplete from '../../utils/AsyncAutoComplete';
import { getAllStaff } from '../../../slices/staffSlice';
import { getAllServices } from '../../../slices/serviceSlice';
import { nanoid } from '@reduxjs/toolkit';
import { collectSale } from '../../../slices/receiptSlice';

const memberSchema = yup.object().shape({
    service: yup.object().nullable().required('Please Select Service Name!'),
    staff: yup.object().nullable().required('Please Select Staff Name!'),
    quantity: yup.number().required('Please Add Quantity!').typeError('Your Quantity is Wrong!'),
    status: yup.string().required('Please select an option!'),
})

const AddService = () => {
    const dispatch = useDispatch()
    const staffs = useSelector(state=> state.Staff.staffs)
    const staffsLoading = useSelector(state=> state.Staff.loading)
    const services = useSelector(state=> state.Service.services)
    const servicesLoading = useSelector(state=> state.Service.loading)
    const [ searchTextStaff,setSearchTextStaff ] = React.useState("")
    const [ searchTextService,setSearchTextService ] = React.useState("")
    const [ status,setStatus ] = useState(null)
    const [ staff, setStaff ] = useState(null)
    const [ service, setService ] = useState(null)

    const fetchStaff = async ()=>{
        await dispatch(getAllStaff({ method: 'get', data: null, keyword: searchTextStaff }))
    }

    const fetchService = async ()=>{
        await dispatch(getAllServices({ method: 'get', data: null, keyword: searchTextService }))
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        trigger,
    } = useForm({
        resolver: yupResolver(memberSchema),
    });

    const handleAddMember = async (data) => {
        const newData = {
            ...data,
            id: nanoid()
        }
        await dispatch(collectSale(newData))
        reset()
        setService(null)
        setStaff(null)
        setStatus(null)
    }

    useEffect(()=>{
        if(status){
            setValue('status', status)
            trigger('status')
        }
    },[status])

    useEffect(()=>{
        if(staff){
            setValue('staff', staff)
            trigger('staff')
        }
    },[staff])

    useEffect(()=>{
        if(service){
            setValue('service', service)
            trigger('service')
        }
    },[service])

    useEffect(()=>{
        fetchService()
    },[searchTextService])

    useEffect(()=>{
        fetchStaff()
    },[searchTextStaff])

    return (
        <Box sx={{ py: 3 }}>
            <form autoComplete='off' onSubmit={handleSubmit(handleAddMember)}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Typography sx={{ pb: 3 }} variant='h6'>Add Service</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 3, width: '100%', gap: 2 }}>
                    <Box sx={{ width: 300 }}>
                        <AsyncAutoComplete setSearchText={setSearchTextService} selectedOption={service} setSelectedOption={setService} options={services?.data || []} placeholder={'Select Service'} error={errors?.service} loading={servicesLoading}/>
                    </Box>
                    <Box sx={{ width: 300 }}>
                        <AsyncAutoComplete setSearchText={setSearchTextStaff} selectedOption={staff} setSelectedOption={setStaff} options={staffs?.data || []} placeholder={'Select Staff'} error={errors?.staff} loading={staffsLoading}/>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 2, mb: 3 }}>
                    <TextField
                        sx={{ width: 300 }}
                        {...register('quantity')}
                        error={!!errors?.quantity}
                        helperText={errors?.quantity?.message}
                        placeholder="Quantity"
                    />
                    <Box sx={{ width: 300 }}>
                        <FormControl>
                            <RadioGroup
                                value={status}
                                onClick={(e)=>{
                                    if(e.target.value){
                                        setValue("status", e.target.value)
                                        setStatus(e.target.value)
                                    }
                                }}
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                                <FormControlLabel value="normal" control={<Radio />} label={<Typography sx={{ fontSize: '12px' }}>Normal</Typography>} />
                                <FormControlLabel value="byname" control={<Radio />} label={<Typography sx={{ fontSize: '12px' }}>Byname</Typography>} />
                            </RadioGroup>
                            <FormHelperText sx={{ color: theme.palette.danger.main }}>{errors?.status?.message}</FormHelperText>
                        </FormControl>
                    </Box>
                </Box>
                <Box sx={{ width: '100%', display: 'flex' ,justifyContent: 'flex-end' }}>
                    <Button type='submit' variant="contained" >Add</Button>
                </Box>
            </form>
        </Box>
    )
}

export default AddService