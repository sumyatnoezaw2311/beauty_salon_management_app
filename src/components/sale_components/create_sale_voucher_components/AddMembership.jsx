import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from "@mui/material"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import AsyncAutoComplete from '../../utils/AsyncAutoComplete';
import { getAllCus } from '../../../slices/customerSlice';
import { getAllStaff } from '../../../slices/staffSlice';
import { getMembershipRec, resetMembership } from '../../../slices/membershipSlice';
import { collectSale, getCustomer } from '../../../slices/receiptSlice';
import { nanoid } from '@reduxjs/toolkit';

const AddMembership = () => {
    const dispatch = useDispatch()
    const memberships = useSelector(state=> state.Membership.memberships)
    const membershipsLoading = useSelector(state=> state.Membership.loading)
    const customers = useSelector(state=> state.Customer.customers)
    const customersLoading = useSelector(state=> state.Customer.loading)
    const staffs = useSelector(state=> state.Staff.staffs)
    const staffsLoading = useSelector(state=> state.Staff.loading)
    const [ customer, setCustomer ] = useState(null)
    const [ searchText,setSearchText ] = useState("")
    const [ searchTextMember,setSearchTextMember ] = useState("")
    const [ searchTextStaff,setSearchTextStaff ] = React.useState("")
    const [ membership, setMembership ] = useState(null)
    const [ staff, setStaff ] = useState(null)
    const [ maxQty,setMaxQty ] = useState(0)
    
    const memberSchema = yup.object().shape({
        membership: yup.object().nullable().required('Please select an option!'),
        staff: yup.object().nullable().required('Please select an option!'),
        quantity: yup.number().min(0).max(maxQty, `Available quantity is maximum ${maxQty}`).required('Please Add Quantity!').typeError('Your Quantity is Wrong!')
    })

    const fetchCustomers = async ()=>{
        await dispatch(getAllCus({ method: 'get', data: null, keyword: searchText }))
    }

    const fetchStaff = async ()=>{
        await dispatch(getAllStaff({ method: 'get', data: null, keyword: searchText }))
    }

    const fetchMemberships = async ()=>{
        if(customer?.id || searchTextMember !== ""){
            await dispatch(getMembershipRec({ method: 'get', data: null, cusId: customer?.id, keyword: searchTextMember }))
        }
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
            id: nanoid(),
            ...data
        }
        await dispatch(collectSale(newData))
        reset()
        setMembership(null)
        setStaff(null)
    }

    useEffect(()=>{
        if(customer){
            setMembership(null)
            dispatch(getCustomer(customer))
            fetchMemberships()
        }else{
            dispatch(getCustomer(null))
            dispatch(resetMembership())
        }
    },[customer])

    useEffect(()=>{
        if(membership){
            setValue('membership', membership)
            trigger('membership')
            setMaxQty(membership.time - Number(membership.usedTime));
        }
    },[membership])

    useEffect(()=>{
        if(staff){
            setValue('staff', staff)
            trigger('staff')
        }
    },[staff])

    useEffect(()=>{
        fetchMemberships()
    },[searchTextMember])
    
    useEffect(()=>{
        fetchCustomers()
    },[searchText])

    useEffect(()=>{
        fetchStaff()
    },[searchTextStaff])
    
    return (
        <Box sx={{ py: 3 }}>
            <Box sx={{ width: 300 }}>
                <AsyncAutoComplete setSearchText={setSearchText} selectedOption={customer} setSelectedOption={setCustomer} options={customers?.data || []} placeholder={'Select Customer'} error={errors?.customer} loading={customersLoading}/>
            </Box>
            <form autoComplete='off' onSubmit={handleSubmit(handleAddMember)}>
                <Typography sx={{ py: 3 }} variant='h6'>Membership</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' ,pb: 3, width: '100%', gap: 2 }}>
                    <Box sx={{ width: 300 }}>
                        <AsyncAutoComplete setSearchText={setSearchTextMember} selectedOption={membership} setSelectedOption={setMembership} options={memberships?.data || []} placeholder={'Select Membership'} error={errors?.membership} loading={membershipsLoading}/>
                    </Box>
                    <Box sx={{ width: 300 }}>
                        <AsyncAutoComplete setSearchText={setSearchTextStaff} selectedOption={staff} setSelectedOption={setStaff} options={staffs?.data || []} placeholder={'Select Staff'} error={errors?.staff} loading={staffsLoading}/>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' , width: '100%', gap: 2 }}>
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


export default AddMembership;
