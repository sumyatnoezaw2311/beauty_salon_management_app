import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField } from "@mui/material"
import * as React from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AsyncAutoComplete from "../utils/AsyncAutoComplete";
import { useDispatch, useSelector } from "react-redux";
import { employeeTrans, getAllStaff } from "../../slices/staffSlice";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const moveShopSchema = yup.object().shape({
    staff: yup.object().nullable().required('Please select an option!'),
    shop: yup.object().nullable().required('Please select an option!'),
})

const MoveOtherShop = ({ open, setOpen, shopData }) => {

    const dispatch = useDispatch()
    const [ filteredShops,setFilteredShops ] = React.useState([])
    const [ searchText,setSearchText ] = React.useState("")
    const [ searchShop,setSearchShop ] = React.useState("")
    const staffs = useSelector(state=> state.Staff.staffs)
    const shops = useSelector(state=> state.Shop.shops)
    const staffsLoading = useSelector(state=> state.Staff.loading)
    const shopsLoading = useSelector(state=> state.Shop.loading)
    const [ staff,setStaff ] = React.useState(null)
    const [ shop,setShop ] = React.useState(null)

    const {
        handleSubmit,
        formState: { errors },
        setValue,
        trigger,
        reset
    } = useForm({
        resolver: yupResolver(moveShopSchema)
    })

    const [isopen, setIsOpen] = React.useState(open);

    const fetchStaffs = async ()=>{
        await dispatch(getAllStaff({ method: 'get', data: null, keyword: searchText, shop: shopData.id }))
    }

    function handleClose() {
        setIsOpen(false)
        setOpen(false)
        reset()
        setStaff(null)
        setShop(null)
    }

    const handleOnSubmit = async (data)=>{
        const newData = {
            employees: [
                {
                    id: data.staff.id,
                    shopId: data.shop.id
                }
            ],
            shopId: shopData.id
        }
        await dispatch(employeeTrans({ method: "patch", data: newData }))
        handleClose()
    }

    React.useEffect(()=>{
        if(shops && shopData){
            const filtered = shops.data.filter(shop=> shop.id !== shopData.id)
            setFilteredShops(filtered)
        }
    },[shops, shopData])

    React.useEffect(()=>{
        if(staff){
            setValue('staff', staff)
            trigger('staff')
        }else{
            setValue('staff', null)
        }
    },[staff])

    React.useEffect(()=>{
        if(shop){
            setValue('shop', shop)
            trigger('shop')
        }else{
            setValue('shop', null)
        }
    },[shop])

    React.useEffect(()=>{
        shopData && fetchStaffs()
    },[searchText, shopData])

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
                <DialogTitle>Employee Transfer</DialogTitle>
                <form onSubmit={handleSubmit(handleOnSubmit)}>
                    <DialogContent sx={{ width: 350 }}>
                        <AsyncAutoComplete setSearchText={setSearchText} selectedOption={staff} setSelectedOption={setStaff} options={staffs?.data || []} placeholder={'Select A Staff'} error={errors?.staff} loading={staffsLoading}/>
                        <Box sx={{ mb: 3 }}></Box>
                        <AsyncAutoComplete setSearchText={setSearchShop} selectedOption={shop} setSelectedOption={setShop} options={filteredShops || []} placeholder={'Select A Shop'} error={errors?.shop} loading={shopsLoading}/>
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

export default MoveOtherShop