import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Box, Divider, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import CustomAutocomplete from '../utils/CustomAutocomplete';
import * as nrc from 'mm-nrc'
import { getAllStaff, staffCud } from '../../slices/staffSlice';
import { shopId } from '../../utils/config';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const validationSchema = yup.object().shape({
    name: yup.string().required('Please add Staff Name!'),
    state: yup.string().required("Select Nrc Type!"),
    township: yup.string().required("Select Township Code!"),
    type: yup.string().required("Select Nrc Type!"),
    nrcNumber: yup.string().required("Nrc Number is required!")
        .matches(/^\d{6}$/, "Nrc must be exactly 6 digits!"),
    address: yup.string().required('Please add Address!'),
    phone: yup.string().required('Please add Phone Number!')
        .matches(/^\d{9,11}$/, 'Your Phone Number is Wrong!'),
    father: yup.string().required(`Please add Father's Name!`),
    basicSalary: yup.number().required('Please add Salary!').positive('Basic Salary is Wrong!').typeError('Basic Salary is Wrong!'),
    saving: yup.number().required('Saving is required').positive('Saving is Wrong!').typeError('Saving is Wrong!'),
})

const UpdateStaff = ({ open, setOpen, oldData }) => {

    const dispatch = useDispatch()
    const [ states,setStates ] = React.useState([])
    const [ selectedState,setSelectedState ] = React.useState(null)
    const [ township,setTownship ] = React.useState([])
    const [ selectedTownship,setSelectedTownship ] = React.useState(null)
    const [ selectedType, setSelectedType ] = React.useState(null)
    const [ types,setTypes ] = React.useState([])
    // const engNrcPattern = nrc.pattern.en;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        trigger
    } = useForm({
        resolver: yupResolver(validationSchema)
    })

    const [isopen, setIsOpen] = React.useState(open);

    const getStates = async ()=>{
        const stateArr = []
        await nrc.getNrcStates().map((state)=> stateArr.push({ id: state.id, name: state.number.en }))
        setStates(stateArr);
    }

    const getTypes = async ()=>{
        const typeArr = []
        await nrc.getNrcTypes().map(type=> typeArr.push({ id: type.id, name: type.name.en }))
        setTypes(typeArr)
    }

    const getTownships = async ()=>{
        const townshipArr = []
        await nrc.getNrcTownshipsByStateId(selectedState?.id).map((township)=> townshipArr.push({ id: township.id, name: township.short.en}))
        setTownship(townshipArr);
    }

    const handleClose = ()=>{
        setIsOpen(false)
        setOpen(false)
        reset()
    }

    const handleOnSubmit = async(data)=>{
        // const validNrc = engNrcPattern.test(`${data.state}/${data.township}(${data.type})${data.nrcNumber}`)
        const newData = {
            id: oldData?.id,
            name : data.name,
            father: data.father,
            address: data.address,
            nrc: `${data.state}/${data.township}(${data.type})${data.nrcNumber}`,
            phone: data.phone,
            basicSalary: data.basicSalary,
            saving: data.saving,
            shopId: shopId
        }
        await dispatch(staffCud({ method: 'put', data: newData, id: oldData?.id }))
        handleClose()
        await dispatch(getAllStaff({ method: 'get', data: null }))
    }

    React.useEffect(()=>{
        if(selectedState === null){
            setSelectedTownship(null)
            setValue('state', null)
            setValue('township', null)
        }else if(selectedState){
            setValue('state', selectedState.name);
            trigger('state')
            getTownships()
        }
    },[selectedState])

    React.useEffect(()=>{
        if(selectedTownship) {
            setValue('township', selectedTownship.name)
            trigger('township')
        }
    },[selectedTownship])

    React.useEffect(()=>{
        if(township.length > 0){
            const { townshipCode } = nrc.splitNrc(oldData.nrc);
            const oldDataTownship = township.filter(el=> el.name === townshipCode);
            setSelectedTownship(oldDataTownship[0]);
        }
    },[township])

    React.useEffect(()=>{
        if(selectedType){
            setValue('type', selectedType.name);
            trigger('type')
            getTownships()
        }
    },[selectedType])

    React.useEffect(
        () => {
            getTypes()
            getStates()
            setIsOpen(open)
        }, [open]
    )

    React.useEffect(()=>{
        if(oldData){
            const { stateNo,nrcNumber,nrcType } = nrc.splitNrc(oldData.nrc);
            const oldDataState = states.filter(state=> state.name === stateNo);
            setSelectedState(oldDataState[0])
            const oldDataType = types.filter(el=> el.name === nrcType);
            setSelectedType(oldDataType[0])
            setValue('nrcNumber', nrcNumber)
            setValue('name', oldData.name)
            setValue('address', oldData.address)
            setValue('phone', oldData.phone)
            setValue('father', oldData.father)
            setValue('basicSalary', oldData.basicSalary)
            setValue('saving', oldData.saving)
        }
    },[oldData,open])

    return (
        <React.Fragment>
            <Dialog
                open={isopen}
                TransitionComponent={Transition}
                onClose={handleClose}
            >
                <DialogTitle>Update Staff</DialogTitle>
                <form autoComplete='off' onSubmit={handleSubmit(handleOnSubmit)}>
                    <DialogContent>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: 450
                        }}>
                            <TextField sx={{ mb: 3 }} {...register('name')} error={!!errors?.name} placeholder='Name' helperText={errors?.name?.message}></TextField>
                            <Box sx={{ mb: 3, display: 'flex', gap: 1 , justifyContent: 'space-between', alignItems: 'start' , width: "100%" }}>
                                <Box style={{ width: '30%' }}>
                                    <CustomAutocomplete selectedOption={selectedState} setSelectedOption={setSelectedState} options={states || []} placeholder={'Nrc Code'} error={errors?.state}></CustomAutocomplete>
                                </Box>
                                <Box style={{ width: '40%' }}>
                                    <CustomAutocomplete selectedOption={selectedTownship || null} setSelectedOption={setSelectedTownship} options={township || []} placeholder={'Township'} error={errors?.township}></CustomAutocomplete>
                                </Box>
                                <Box style={{ width: '30%' }}>
                                    <CustomAutocomplete selectedOption={selectedType} setSelectedOption={setSelectedType} options={types || []} placeholder={'Nrc Type'} error={errors?.type}></CustomAutocomplete>
                                </Box>
                            </Box>
                            <TextField sx={{ mb: 3 }} {...register('nrcNumber')} error={!!errors?.nrcNumber} placeholder='Nrc Number' helperText={errors?.nrcNumber?.message}></TextField>
                            <TextField sx={{ mb: 3 }} {...register('address')} error={!!errors?.address} placeholder='Address' helperText={errors?.address?.message}></TextField>
                            <TextField sx={{ mb: 3 }} {...register('phone')} error={!!errors?.phone} placeholder='Phone' helperText={errors?.phone?.message}></TextField>
                            <TextField sx={{ mb: 3 }} {...register('father')} error={!!errors?.father} placeholder='Father' helperText={errors?.father?.message}></TextField>
                            <TextField sx={{ mb: 3 }} {...register('basicSalary')} error={!!errors?.basicSalary} placeholder='Basic Salary' helperText={errors?.basicSalary?.message}></TextField>
                            <TextField {...register('saving')} error={!!errors?.saving} placeholder='Basic Salary' helperText={errors?.saving?.message}></TextField>
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

export default UpdateStaff