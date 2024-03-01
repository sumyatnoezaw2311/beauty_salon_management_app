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
import { getAttendenceBonus, updateAttBonus } from '../../slices/attendenceSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const validationSchema = yup.object().shape({
    bonus: yup.number().required('Please add the bonus!').typeError('Your bonus is Wrong!')
})


const AttBonusEdit = ({ open, setOpen, oldData }) => {

    const dispatch = useDispatch()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
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
        const newData = {
            id: oldData.id,
            bonus: data.bonus
        }
        await dispatch(updateAttBonus({ method: 'put', data: newData, id: oldData.id }))
        handleClose()
        await dispatch(getAttendenceBonus({ method: 'get', data: null }))
    }

    React.useEffect(
        () => {
            setIsOpen(open)
            if(oldData){
                setValue('bonus', oldData.bonus)
            }
        }, [open]
    )
    return (
        <React.Fragment>
            <Dialog
                open={isopen}
                TransitionComponent={Transition}
                onClose={handleClose}
            >
                <DialogTitle>Edit Attendence Bonus</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '300px'
                        }}>
                            {/* <AsyncAutoComplete setSearchText={setSearchText} selectedOption={item} setSelectedOption={setItem} options={items?.data || []} placeholder={'Select Item'} error={errors?.item} loading={itemsLoading}/> */}
                            <TextField {...register('bonus')} error={!!errors?.bonus} label='Bonus' helperText={errors?.bonus?.message}></TextField>
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

export default AttBonusEdit