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
import { getAllShops, shopCud } from '../../slices/shopSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const validationSchema = yup.object().shape({
    name: yup.string().required('Please add Shop Name!'),
    address: yup.string().required('Please add address!'),
    phone: yup.string().required('Please add Phone Number!')
        .matches(/^\d{9,11}$/, 'Your Phone Number is Wrong!'),
})

const UpdateShop = ({ open, setOpen, oldData }) => {

    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm({
        resolver: yupResolver(validationSchema)
    })

    const [isopen, setIsOpen] = React.useState(open);

    function handleClose() {
        setIsOpen(false)
        setOpen(false)
        reset();
    }

    const onSubmit = async (data)=>{
        await dispatch(shopCud({ method: 'put', data: data, id: oldData?.id || null }));
        handleClose()
        await dispatch(getAllShops({ method: 'get', data: null }))
        reset()
    }

    React.useEffect(
        () => {
            if(oldData){
                setValue('name', oldData.name)
                setValue('address', oldData.address)
                setValue('phone', oldData.phone)
            }
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
                <DialogTitle>Update Shop</DialogTitle>
                <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '300px'
                        }}>
                            <TextField {...register('name')} error={!!errors?.name} label='Shop Name' helperText={errors?.name?.message}></TextField>
                            <Box sx={{ height: '20px' }}></Box>
                            <TextField multiline {...register('address')} error={!!errors?.address} label='address' helperText={errors?.address?.message}></TextField>
                            <Box sx={{ height: '20px' }}></Box>
                            <TextField {...register('phone')} error={!!errors?.phone} label='Phone Number' helperText={errors?.phone?.message}></TextField>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} sx={{ fontWeight: 'bold' }}>Close</Button>
                        <Button type='submit' sx={{ fontWeight: 'bold' }}>Update</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment>
    )
}

export default UpdateShop