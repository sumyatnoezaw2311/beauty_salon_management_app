import { Button, DialogActions, TextField, DialogContent, DialogTitle,Dialog, Slide, alpha } from "@mui/material"
import theme from "../../utils/theme";
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from "react-redux";
import { addStock, getAllItem } from "../../slices/itemSlice";
import { shopId } from "../../utils/config";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const addStockSchema = yup.object().shape({
    quantity: yup.number().required('Please Add Quantity!').typeError('Your Quantity is Wrong!')
})

const AddStock = ({ open, setOpen, idToAdd }) => {

    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(addStockSchema)
    })

    const [isopen, setIsOpen] = React.useState(open);

    const fetchStocks = async ()=>{
        await dispatch(getAllItem({ method: 'get', data: null }))
    }

    function handleClose() {
        setIsOpen(false)
        setOpen(false)
        reset()
    }

    const handleOnSubmit = async (data)=>{
        const newData = {
            id: idToAdd,
            quantity: data.quantity,
            shopId: shopId
        }
        await dispatch(addStock({ method: 'post', data: newData, id: idToAdd }))
        fetchStocks()
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
                <DialogTitle>Add Stock</DialogTitle>
                <form onSubmit={handleSubmit(handleOnSubmit)}>
                    <DialogContent sx={{
                        width: '350px'
                    }}>
                        <TextField fullWidth {...register('quantity')} error={!!errors?.quantity} placeholder='Quantity' helperText={errors?.quantity?.message}></TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} sx={{ fontWeight: 'bold', color: alpha(theme.palette.dark.main, 0.5) }}>Close</Button>
                        <Button type='submit' sx={{ fontWeight: 'bold' }}>Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment>
    )
}

export default AddStock