import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Box, TextField, alpha } from '@mui/material';
import theme from '../../utils/theme';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CustomAutocomplete from '../utils/CustomAutocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategory, getAllItem, itemCud } from '../../slices/itemSlice';
import { shopId } from '../../utils/config';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const validationSchema = yup.object().shape({
    name: yup.string().required('Please add Item Name!'),
    category: yup.object().required('Please Select Category!'),
    salePrice: yup.number().required('Please Add Sale Price!').typeError('Your Sale Price is Wrong!'),
    purchasePrice: yup.number().typeError('Your Purchase Price is Wrong!'),
    quantity: yup.number().required('Please Add Quantity!').typeError('Your Quantity is Wrong!'),
    commission: yup.number().typeError("Please fill a valid commission value!").required("Commission percentage is required!")
})

const CreateNewStock = ({ open, setOpen }) => {

    const dispatch = useDispatch()
    const [category, setCategory] = React.useState(null);
    const [isopen, setIsOpen] = React.useState(open);
    const categories = useSelector(state=> state.Item.categories)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        trigger,
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            purchasePrice: 0,
        },
    })


    function handleClose() {
        setIsOpen(false)
        setOpen(false)
        reset()
        setCategory(null)
    }

    const fetchData = async()=>{
        await dispatch(getAllItem({ method: 'get', data: null }))
    }

    const fetchCategories = async ()=>{
        await dispatch(getAllCategory({ method: 'get', data: null }))
    }

    const handleOnSubmit = async (data)=>{
        const newData = {
            name: data.name,
            categoryId: data.category.id,
            salePrice: data.salePrice,
            purchasePrice: data.purchasePrice,
            stock : data.quantity,
            commissionPercent: data.commission,
            shopId : shopId()
        }
        await dispatch(itemCud({ method: 'post', data: newData, id: null }))
        fetchData()
        setOpen(false)
        reset()
        setCategory(null)
        setValue('category', null)
    }

    React.useEffect(()=>{
        if(category){
            setValue('category', category)
            trigger('category')
        }else{
            setValue('category', null)
        }
    },[category])

    React.useEffect(
        () => {
            fetchCategories()
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
                <DialogTitle>Create New Stock</DialogTitle>
                <form autoComplete='off' onSubmit={handleSubmit(handleOnSubmit)}>
                    <DialogContent sx={{
                        width: 400,
                    }}>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <TextField sx={{ mb: 3 }} {...register('name')} error={!!errors?.name} label='Item Name' helperText={errors?.name?.message}></TextField>
                            <CustomAutocomplete selectedOption={category} setSelectedOption={setCategory} options={categories?.data || []} placeholder={'Select Category'} error={errors?.category}></CustomAutocomplete>
                            <TextField sx={{ mt: 3 }} {...register('salePrice')} error={!!errors?.salePrice} label='Sale Price' helperText={errors?.salePrice?.message}></TextField>
                            <TextField sx={{ mt: 3 }} {...register('purchasePrice')} fullWidth error={!!errors?.purchasePrice} label='Purchase Price' helperText={errors?.purchasePrice?.message}></TextField>
                            <TextField sx={{ mt: 3 }} {...register('quantity')} error={!!errors?.quantity} label='Quantity' helperText={errors?.quantity?.message}></TextField>
                            <TextField sx={{ mt: 3 }} {...register('commission')} error={!!errors?.commission} label='Commission (%)' helperText={errors?.commission?.message}></TextField>
                        </Box>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} sx={{ fontWeight: 'bold', color: alpha(theme.palette.dark.main, 0.5) }}>Close</Button>
                        <Button type='submit' sx={{ fontWeight: 'bold' }}>Create</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment>
    )
}

export default CreateNewStock