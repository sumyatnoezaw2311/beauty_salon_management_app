import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField } from "@mui/material"
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from "react-redux";
import { expenseCrud, getAllExpense } from "../../slices/expenseSlice";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const createExpensesSchema = yup.object().shape({
    amount: yup.number().required('Please Add Amount!').typeError('Your Amount is Wrong!'),
    description: yup.string().nullable(true).required("Description is required!")
})

const AddNewExpenses = ({ open, setOpen }) => {

    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(createExpensesSchema)
    })

    const [isopen, setIsOpen] = React.useState(open);

    function handleClose() {
        setIsOpen(false)
        setOpen(false)
        reset({
            amount: '',
            description: ''
        })
    }

    const handleOnSubmit = async (data)=>{
        await dispatch(expenseCrud({ method: 'post', data: data, id: null }))
        await dispatch(getAllExpense({ method: 'get', data: null }))
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
                <DialogTitle>Add New Expenses</DialogTitle>
                <form autoComplete='off' onSubmit={handleSubmit(handleOnSubmit)}>
                    <DialogContent>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: 300
                        }}>
                            <TextField sx={{ mb: 3 }} {...register('amount')} error={!!errors?.amount} helperText={errors?.amount?.message} placeholder="Amount"></TextField>
                            <TextField multiline {...register('description')} error={!!errors?.description} helperText={errors?.description?.message} placeholder="Description"></TextField>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} sx={{ fontWeight: 'bold' }}>Cancel</Button>
                        <Button type="submit" sx={{ fontWeight: 'bold' }}>Create</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment>
    )
}

export default AddNewExpenses