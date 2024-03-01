import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import Slide from '@mui/material/Slide';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AsyncAutoComplete from '../utils/AsyncAutoComplete';
import { getAllStaff } from '../../slices/staffSlice';
import theme from '../../utils/theme';
import ReactDatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { shopId } from '../../utils/config';
import { salaryAdjust } from '../../slices/salarySlice';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const validationSchema = yup.object().shape({
  employee: yup.object().nullable().required('Please Select Staff!'),
  date: yup.string().nullable().required('Please Select Date!'),
  penaltyFee: yup.number().required('Please Add Penalty Fee!').typeError('Your fee is Wrong!'),
  attendanceBonus: yup.boolean().required('Please select an option'),
});

const SalaryAdjustDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [staff, setStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const { staffs, loading } = useSelector((state) => state.Staff);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const [isopen, setIsOpen] = useState(open);

  const fetchStaffs = async () => {
    await dispatch(getAllStaff({ method: 'get', data: null, keyword: searchText }));
  };

  const handleClose = () => {
    setIsOpen(false);
    setOpen(false);
    reset();
  };

  const onSubmit = async (data) => {
    const newData = {
        attendanceBonus: data.attendanceBonus,
        date: data.date,
        employeeId: data.employee.id,
        penaltyFee: data.penaltyFee,
        shopId: shopId()
    }
    await dispatch(salaryAdjust({ method: 'post', data: newData }))
    reset()
    setSelectedDate(null)
    setStaff(null)
    handleClose()
  };

  useEffect(()=>{
    if(staff) setValue('employee', staff)
  },[staff])

  useEffect(() => {
    fetchStaffs();
  }, [searchText]);

  useEffect(() => {
    fetchStaffs();
    setIsOpen(open);
  }, [open]);

  return (
    <React.Fragment>
      <Dialog open={isopen} TransitionComponent={Transition} onClose={handleClose}>
        <DialogTitle>Penalty Fee & Bonus</DialogTitle>
        <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: 300,
              }}
            >
              <AsyncAutoComplete
                loading={loading}
                setSearchText={setSearchText}
                selectedOption={staff}
                setSelectedOption={setStaff}
                options={staffs?.data || []}
                placeholder={'Select Staff'}
                error={errors.employee}
                size={'large'}
              />
              <TextField
                sx={{ my: 3 }}
                {...register('penaltyFee')}
                error={!!errors?.penaltyFee}
                placeholder="PenaltyFee"
                helperText={errors?.penaltyFee?.message}
              />
              <ReactDatePicker
                showMonthYearPicker
                isClearable
                placeholderText="Select Month"
                dateFormat="MM-yyyy"
                selected={selectedDate}
                className={errors.date ? 'customDatePicker1 customDatePickerError' : 'customDatePicker1'}
                onChange={(date) => {
                    if (date instanceof Date && !isNaN(date)) {
                        const formattedDate = format(date, 'yyyy-MM-dd');
                        setSelectedDate(date);
                        setValue('date', formattedDate);
                    }
                }}
                />
              <FormHelperText sx={{ color: theme.palette.danger.main }}>{errors.date?.message}</FormHelperText>
              <FormControl sx={{ mt: 2 }} error={errors.attendanceBonus} variant="standard">
                <FormLabel id="demo-error-radios">Attendance Bonus</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-error-radios"
                  name="quiz"
                  value={getValues('attendanceBonus') || null}
                  onChange={(event) => {
                    setValue('attendanceBonus', event.target.value);
                    trigger('attendanceBonus');
                  }}
                >
                  <FormControlLabel value={true} control={<Radio />} label="Yes" />
                  <FormControlLabel value={false} control={<Radio />} label="No!" />
                </RadioGroup>
              </FormControl>
              <FormHelperText sx={{ color: theme.palette.danger.main }}>{errors.attendanceBonus?.message}</FormHelperText>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{ fontWeight: 'bold' }}>
              Close
            </Button>
            <Button type="submit" sx={{ fontWeight: 'bold' }}>
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default SalaryAdjustDialog;
