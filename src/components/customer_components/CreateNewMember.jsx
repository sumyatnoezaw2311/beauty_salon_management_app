import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Autocomplete, Box, Divider, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import AsyncAutoComplete from '../utils/AsyncAutoComplete';
import { getAllStaff } from '../../slices/staffSlice';
import { getAllServices } from '../../slices/serviceSlice';
import { getAllCus } from '../../slices/customerSlice';
import { shopId } from '../../utils/config';
import { getMembershipRec, membershipCud } from '../../slices/membershipSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const createMemberSchema = yup.object().shape({
    service: yup.object().nullable().required('Please Select Service Name!'),
    time: yup.number().required('Please add Times!').typeError('Your Times is Wrong!'),
    freeTime: yup.number().required('Please add Times for Bonus!').typeError('Your Bonus Times is Wrong!'),
    staff: yup.object().nullable().required('Please select an option!'),
    commission: yup.number().required('Please enter commission (%) !').typeError('Commission is Wrong!'),
    customer: yup.object().nullable().required('Please select an option!'),
    cash: yup.number().required('Please add cash!').typeError('Your cash is Wrong!'),
    kpay: yup.number().required('Please add kpay!').typeError('Your kpay is Wrong!'),
})

const CreateNewMember = ({ open, setOpen }) => {
    const dispatch = useDispatch()
    const staffs = useSelector(state=> state.Staff.staffs)
    const services = useSelector(state=> state.Service.services)
    const customers = useSelector(state=> state.Customer.customers)
    const staffsLoading = useSelector(state=> state.Staff.loading)
    const servicesLoading = useSelector(state=> state.Service.loading)
    const customersLoading = useSelector(state=> state.Customer.loading)
    const [ searchText,setSearchText ] = React.useState("")
    const [ searchTextCus,setSearchTextCus ] = React.useState("")
    const [ searchTextService,setSearchTextService ] = React.useState("")
    const [ staff,setStaff ] = React.useState(null)
    const [ service,setService ] = React.useState(null)
    const [ customer,setCustomer ] = React.useState(null)
    const [isopen, setIsOpen] = React.useState(open);
    const [ time,setTime ] = useState("")
    const [ totalPrice,setTotalPrice ] = useState(0)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        trigger
    } = useForm({
        resolver: yupResolver(createMemberSchema),
        defaultValues:{
            cash: 0, 
            kpay: 0,
            freeTime: 1,
        }
    })

    const fetchStaffs = async ()=>{
        await dispatch(getAllStaff({ method: 'get', data: null, keyword: searchText, shop: null }))
    }

    const fetchServices = async ()=>{
        await dispatch(getAllServices({ method: 'get', data: null, keyword: searchTextService }))
    }

    const fetchCustomers = async ()=>{
        await dispatch(getAllCus({ method: 'get', data: null, keyword: searchTextCus }))
    }

    const handleOnSubmit = async (data)=>{
        const newData = {
            shopId: shopId(),
            serviceId: data.service.id,
            time: data.time,
            freeTime: data.freeTime,
            commissionPercent: data.commission,
            cash: data.cash,
            kpay: data.kpay,
            customerId: data.customer.id,
            employeeId: data.staff.id
        }
        await dispatch(membershipCud({ method: 'post', data: newData }))
        await dispatch(getMembershipRec({ method: 'get', data: null }))
        handleClose()
    }

    function handleClose() {
        setIsOpen(false)
        setOpen(false)
        reset()
        setService(null)
        setCustomer(null)
        setStaff(null)
        setTime("")
    }

    React.useEffect(()=>{
        fetchStaffs()
    },[searchText])

    React.useEffect(()=>{
        fetchServices()
    },[searchTextService])

    React.useEffect(()=>{
        fetchCustomers()
    },[searchTextCus])

    React.useEffect(()=>{
        if(staff){
            setValue('staff', staff)
            trigger('staff')
        }else{
            setValue('staff', null)
        }
    },[staff])

    React.useEffect(()=>{
        if(customer){
            setValue('customer', customer)
            trigger('customer')
        }else{
            setValue('customer', null)
        }
    },[customer])

    React.useEffect(()=>{
        if(service){
            setValue('service', service)
            trigger('service')
        }else{
            setValue('service', null)
        }
    },[service])

    React.useEffect(()=>{
        if(customer){
            setValue('customer', customer)
            trigger('customer')
        }else{
            setValue('customer', null)
        }
    },[customer])

    useEffect(()=>{
        if(service && time){
            setValue('time', time)
            trigger('time')
            setValue("cash", Number(service.price) * time);
            setTotalPrice(Number(service.price) * time)
        }
    },[service, time])

    React.useEffect(
        () => {
            fetchStaffs()
            fetchServices()
            fetchCustomers()
            setIsOpen(open)
        }, [open]
    )

    return (
        <React.Fragment>
            <Dialog
                open={isopen}
                TransitionComponent={Transition}
                onClose={handleClose}
            >
                <DialogTitle>Create New Member</DialogTitle>
                <form autoComplete='off' onSubmit={handleSubmit(handleOnSubmit)}>
                    <DialogContent sx={{ py: 0 }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: 500
                        }}>
                            <Box sx={{ mb: 3, display: 'flex', gap: 2, pt: 2 }}>
                                <Box sx={{ width: '50%' }}>
                                    <AsyncAutoComplete loading={customersLoading} setSearchText={setSearchTextCus} selectedOption={customer} setSelectedOption={setCustomer} options={customers?.data || []} placeholder={'Select Customer'} error={errors?.customer}/>
                                </Box>
                                <Box sx={{ width: '50%' }}>
                                    <AsyncAutoComplete loading={servicesLoading} setSearchText={setSearchTextService} selectedOption={service} setSelectedOption={setService} options={services?.data || []} placeholder={'Select Service'} error={errors?.service}/>
                                </Box>
                            </Box>
                            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                                <Box sx={{ width: '50%' }}>
                                    <TextField
                                        fullWidth
                                        id="outlined-controlled"
                                        label="Total Time"
                                        value={time}
                                        onChange={(event) => {
                                        setTime(event.target.value);
                                    }} error={!!errors?.time} helperText={errors?.time?.message}></TextField>
                                </Box>
                                <Box sx={{ width: '50%' }}>
                                    <TextField fullWidth {...register('freeTime')} error={!!errors?.freeTime} label='Free Time' helperText={errors?.freeTime?.message}></TextField>
                                </Box>
                            </Box>
                            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                                <Box sx={{ width: '50%' }}>
                                    <AsyncAutoComplete loading={staffsLoading} setSearchText={setSearchText} selectedOption={staff} setSelectedOption={setStaff} options={staffs?.data || []} placeholder={'Select Staff'} error={errors?.staff}/>
                                </Box>
                                <Box sx={{ width: '50%' }}>
                                    <TextField fullWidth {...register('commission')} error={!!errors?.commission} label='Commission(%)' helperText={errors?.commission?.message}></TextField>
                                </Box>
                            </Box>
                            <Divider sx={{ mb: 3 }}>Total Price - {totalPrice} MMK</Divider>
                            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                                <Box sx={{ width: '50%' }}>
                                    <TextField fullWidth {...register('cash')} error={!!errors?.cash} label='Paid (Cash)' helperText={errors?.cash?.message}></TextField>
                                </Box>
                                <Box sx={{ width: '50%' }}>
                                    <TextField fullWidth {...register('kpay')} error={!!errors?.kpay} label='Paid (Kpay)' helperText={errors?.kpay?.message}></TextField>
                                </Box>
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} sx={{ fontWeight: 'bold' }}>Close</Button>
                        <Button type='submit' sx={{ fontWeight: 'bold' }}>Create</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment>
    )
}

export default CreateNewMember