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
import { useDispatch, useSelector } from 'react-redux';
import { damagedCud, getAllDamaged, getAllItem, getAllServiceSupply, serviceSupplyCud } from '../../slices/itemSlice';
import AsyncAutoComplete from '../utils/AsyncAutoComplete';
import { shopId } from '../../utils/config';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const validationSchema = yup.object().shape({
    item: yup.object().nullable().required('Please Select Item Name!'),
    quantity: yup.number().required('Please Add Quantity!').typeError('Your Quantity is Wrong!')
})


const CreateUsage = ({ open, setOpen, type }) => {

    const dispatch = useDispatch()
    const items = useSelector(state=> state.Item.items)
    const itemsLoading = useSelector(state=> state.Item.loading)
    const [ searchText,setSearchText ] = React.useState("")
    const [item, setItem] = React.useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        trigger,
        reset
    } = useForm({
        resolver: yupResolver(validationSchema)
    })

    const [isopen, setIsOpen] = React.useState(open);

    const fetchItems = async ()=>{
        await dispatch(getAllItem({ method: 'get', data: null, keyword: searchText }))
    }

    function handleClose() {
        setIsOpen(false)
        setOpen(false)
        reset();
    }

    const onSubmit = async (data)=>{
        const newData = {
            itemId: data.item.id,
            shopId: shopId,
            quantity: data.quantity
        }
        if(type !== 'ss' ){
            await dispatch(damagedCud({ method: 'post', data: newData, id: null }))
            await dispatch(getAllDamaged({ method: 'get', data: null }))
        }else{
            await dispatch(serviceSupplyCud({ method: 'post', data: newData, id: null }));
            await dispatch(getAllServiceSupply({ method: 'get', data: null }))
        }
        handleClose()
    }

    React.useEffect(()=>{
        fetchItems()
    },[searchText])

    React.useEffect(()=>{
        if(item){
            setValue('item', item)
            trigger('item')
        }else{
            setValue('item', null)
        }
    },[item])

    React.useEffect(
        () => {
            setItem(null)
            setSearchText(null)
            fetchItems()
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
                <DialogTitle>Add {type === 'ss' ? "Service Supply" : "Damaged"} Item</DialogTitle>
                <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '300px'
                        }}>
                            <AsyncAutoComplete setSearchText={setSearchText} selectedOption={item} setSelectedOption={setItem} options={items?.data || []} placeholder={'Select Item'} error={errors?.item} loading={itemsLoading}/>
                            <TextField sx={{ mt: 3 }} {...register('quantity')} error={!!errors?.quantity} placeholder='Quantity' helperText={errors?.quantity?.message}></TextField>
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

export default CreateUsage