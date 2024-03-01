import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField } from "@mui/material"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AsyncAutoComplete from "../utils/AsyncAutoComplete";
import { useDispatch, useSelector } from "react-redux";
import { getAllStaff } from "../../slices/staffSlice";
import { shopId } from '../../utils/config';
import { advanceCud, getAllAdvance } from '../../slices/salaryAdvanceSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const createCashAdvanceSchema = yup.object().shape({
    staff: yup.object().nullable().required('Please Select Staff Name!'),
    amount: yup.number().required('Please Add Amount!').typeError('Your Amount is Wrong!'),
    note: yup.string().nullable(true)
})

const AddCashAdvance = ({ open, setOpen }) => {
    const dispatch = useDispatch()
    const staffsLoading = useSelector(state=> state.Staff.loading)
    const staffs = useSelector(state=> state.Staff.staffs)
    const [isopen, setIsOpen] = React.useState(open);
    const [ searchText,setSearchText ] = useState('')
    const [ staff,setStaff ] = useState(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        trigger,
    } = useForm({
        resolver: yupResolver(createCashAdvanceSchema)
    })

    function handleClose() {
        setIsOpen(false)
        setOpen(false)
        reset()
        setStaff(null)
    }

    const fetchStaffs = async ()=>{
        await dispatch(getAllStaff({ method: 'get', data: null, keyword: searchText, shop: shopId() }))
    }

    const handleOnSubmit = async (data)=>{
        const newData = {
            employeeId: data.staff.id,
            price: data.amount,
            description: data.note,
            shopId: shopId
        }
        await dispatch(advanceCud({ method: 'post', data: newData, id: null }))
        await dispatch(getAllAdvance({ method: 'get', data: null }))
        handleClose()
    }

    React.useEffect(()=>{
        if(staff){
            setValue('staff', staff)
            trigger('staff')
        }else{
            setValue('staff', null)
        }
    },[staff])

    React.useEffect(()=>{
        fetchStaffs()
    },[searchText])

    React.useEffect(
        () => {
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
                <DialogTitle>Add Salary Advance</DialogTitle>
                <form autoComplete='off' onSubmit={handleSubmit(handleOnSubmit)}>
                    <DialogContent>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: 400
                        }}>
                            <AsyncAutoComplete loading={staffsLoading} setSearchText={setSearchText} selectedOption={staff} setSelectedOption={setStaff} options={staffs?.data || []} placeholder={'Select Staff'} error={errors?.staff}/>
                            <Box sx={{ height: '20px' }}></Box>
                            <TextField {...register('amount')} error={!!errors?.amount} helperText={errors?.amount?.message} label="Amount"></TextField>
                            <Box sx={{ height: '20px' }}></Box>
                            <TextField {...register('note')} error={!!errors?.note} helperText={errors?.note?.message} label="Note"></TextField>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} sx={{ fontWeight: 'bold' }}>Cancel</Button>
                        <Button type="submit" sx={{ fontWeight: 'bold' }}>Done</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment>
    )
}

export default AddCashAdvance