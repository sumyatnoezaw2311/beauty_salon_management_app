import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Box, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { getAllServices, serviceCud } from '../../slices/serviceSlice';
import { shopId } from '../../utils/config';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const createServiceSchema = yup.object().shape({
    name: yup.string().required('Please add Service Name!'),
    price: yup.number().required('Please add Price!').typeError('Your Price is Wrong!'),
    normalCommissionPercent: yup.number().typeError("Please fill a valid commission value!").required("Commission percentage is required!"),
    bynameCommissionPercent: yup.number().typeError("Please fill a valid commission value!").required("Commission percentage is required!")
})

const CreateNewService = ({ open, setOpen }) => {

    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(createServiceSchema)
    })

    const [isopen, setIsOpen] = React.useState(open);

    const handleClose = ()=>{
        setIsOpen(false)
        setOpen(false)
        reset()
    }

    const handleOnSubmit = async(data)=>{
        const newData = {...data, shopId: shopId}
        await dispatch(serviceCud({ method: 'post', data: newData, id: null }))
        handleClose()
        await dispatch(getAllServices({ method: 'get', data: null }))
    }

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
                <DialogTitle>Create New Service</DialogTitle>
                <form autoComplete='off' onSubmit={handleSubmit(handleOnSubmit)}>
                    <DialogContent>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: 350
                        }}>
                            <TextField sx={{ mb: 3 }} {...register('name')} error={!!errors?.name} label='Name' helperText={errors?.name?.message}></TextField>
                            <TextField sx={{ mb: 3 }} {...register('price')} error={!!errors?.price} label='Price' helperText={errors?.price?.message}></TextField>
                            <TextField sx={{ mb: 3 }} {...register('normalCommissionPercent')} error={!!errors?.normalCommissionPercent} label='Normal Commission Percent' helperText={errors?.normalCommissionPercent?.message}></TextField>
                            <TextField {...register('bynameCommissionPercent')} error={!!errors?.bynameCommissionPercent} label='Byname Commission Percent' helperText={errors?.bynameCommissionPercent?.message}></TextField>
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

export default CreateNewService