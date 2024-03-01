import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Slide, TextField } from "@mui/material";
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import { createAccount } from "../../slices/authSlice";
import { getAllUsers } from "../../slices/userSlice";
import { shopId } from "../../utils/config";
import AsyncAutoComplete from "../utils/AsyncAutoComplete";
import { getAllShops } from "../../slices/shopSlice";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const createAccountSchema = yup.object().shape({
    name: yup.string().required('Please add Shop Name!'),
    position: yup.string().required('Please add Position!'),
    email: yup.string().email('Your Email is Wrong!').required('Please add Email Address!'),
    password: yup.string().min(8, "Password must be at least 8 characters").max(8, "Password must be minimum 8 characters").required('Password is required'),
    type: yup.string().required("Select account type!"),
    shop: yup.object().required("Please select an option")
});

const AddNewAccount = ({ open, setOpen }) => {
    const dispatch = useDispatch()
    const [ searchText,setSearchText ] = React.useState("")
    const [ shop, setShop ] = React.useState(null);
    const { shops: shops, loading } = useSelector(state=> state.Shop)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        trigger
    } = useForm({
        resolver: yupResolver(createAccountSchema)
    });

    const fetchData = async()=>{
        await dispatch(getAllUsers({ method: 'get', data: null }))
    }
    const fetchShop = async()=>{
        await dispatch(getAllShops({ method: 'get', data: null }))
    }

    const handleClose = () => {
        setOpen(false);
        reset();
        setShop(null)
    };

    const handleOnChange = (event)=>{
        setValue("type",event.target.value);
    }

    const onSubmit = async (data) => {
        const newData = {...data, shopId: data.shop.id}
        await dispatch(createAccount({ method: 'post', data: newData }))
        handleClose();
        await fetchData()
    };

    React.useEffect(()=>{
        if(shop){
            setValue('shop', shop)
            trigger('shop')
        }else{
            setValue('shop', null)
        }
    },[shop])

    React.useEffect(() => {
        setOpen(open);
        if(!shops){
            fetchShop()
        }
    }, [open, setOpen]);

    return (
        <React.Fragment>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                onClose={handleClose}
            >
                <DialogTitle>Add New Account</DialogTitle>
                <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '350px'
                        }}>
                            <TextField sx={{ mb: 3}} {...register('name')} error={!!errors?.name} helperText={errors?.name?.message} label="Name" />
                            <AsyncAutoComplete loading={loading} setSearchText={setSearchText} selectedOption={shop} setSelectedOption={setShop} options={shops?.data || []} placeholder={'Select Shop'} error={errors?.shop}/>
                            <TextField sx={{ my: 3}} {...register('position')} error={!!errors?.position} helperText={errors?.position?.message} label="Position" />
                            <TextField sx={{ mb: 3}} {...register('email')} error={!!errors?.email} helperText={errors?.email?.message} label="Email" />
                            <TextField sx={{ mb: 3}} {...register('password')} error={!!errors?.password} helperText={errors?.password?.message} label="Password" />
                            <FormControl>
                                <FormLabel id="demo-radio-buttons-group-label" sx={{ mb: 1 }}>Type</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="female"
                                    name="radio-buttons-group"
                                    row
                                    onChange={handleOnChange}
                                >
                                    <FormControlLabel value="owner" control={<Radio />} label="Owner" />
                                    <FormControlLabel value="employee" control={<Radio />} label="Staff" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} sx={{ fontWeight: 'bold' }}>Cancel</Button>
                        <Button type="submit" sx={{ fontWeight: 'bold' }}>Create</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment>
    );
};

export default AddNewAccount;
