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
import { customerCud, getAllCus } from '../../slices/customerSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const createCustomerSchema = yup.object().shape({
    name: yup.string().required('Please add Customer Name!'),
    address: yup.string(),
    phone: yup.string().required('Please add Phone Number!')
        .matches(/^\d{9,11}$/, 'Your Phone Number is Wrong!'),
})

const CreateNewCustomer = ({ open, setOpen }) => {

    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(createCustomerSchema)
    })

    const [isopen, setIsOpen] = React.useState(open);

    function handleClose() {
        setIsOpen(false)
        setOpen(false)
        reset();
    }

    const handleOnSubmit = async (data)=>{
        await dispatch(customerCud({ method: 'post', data: data, id: null }))
        await dispatch(getAllCus({ method: 'get', data: null, keyword: "" }))
        handleClose()
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
                <DialogTitle>Create New Customer</DialogTitle>
                <form autoComplete='off' onSubmit={handleSubmit(handleOnSubmit)}>
                    <DialogContent
                        sx={{ width: 350 }}
                        >
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <TextField sx={{ mb: 2 }} {...register('name')} error={!!errors?.name} label='Customer Name' helperText={errors?.name?.message}></TextField>
                            <TextField sx={{ mb: 2 }} {...register('address')} error={!!errors?.address} label='Address' helperText={errors?.address?.message}></TextField>
                            <TextField sx={{ mb: 2 }} {...register('phone')} error={!!errors?.phone} label='Phone Number' helperText={errors?.phone?.message}></TextField>
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

export default CreateNewCustomer