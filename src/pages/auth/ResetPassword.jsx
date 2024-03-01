import React, { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import huameiLogo from "../../assets/images/hua_mei_logo.png";
import theme from "../../utils/theme";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import SendIcon from '@mui/icons-material/Send';
import { resetPassword, verifyToken } from "../../slices/authSlice";

const validationSchema = Yup.object({
    password: Yup.string().min(8, "Password must be at least 8 characters").max(8, "Password must be minimum 8 characters").required('Password is required'),
    confirm_password: Yup.string()
        .required("Password is required")
        .min(8,"Password must be at least 8 characters")
        .oneOf([Yup.ref('password'), null], 'Confurn Password must be equal to password'),
});

 
const ResetPassword = () => {
    const { oneTimeToken } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loading = useSelector(state=> state.Auth.loading)

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const checkValidToken = async()=>{
        const checkDispatch = await dispatch(verifyToken({ method: 'get', data: null, verifyToken: oneTimeToken }))
        if(checkDispatch.meta.requestStatus === 'rejected'){
            navigate('/forgot-password')
        }
    }

    const onSubmit = async (data)=>{
        const newData = {
            email: localStorage.getItem('huamei_forgot_email'),
            password: data.password,
            password_confirmation: data.confirm_password,
            token: oneTimeToken,
        }
        await dispatch(resetPassword({ method: 'put', data: newData }))
        localStorage.removeItem('huamei_forgot_email')
        navigate('/login')
    }

    useEffect(()=>{
        checkValidToken()
    },[])

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              mb: 3,
              flexDirection: "row-reverse",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <img
              height={80}
              src={`${huameiLogo}`}
              alt={"Hua Mei"}
              loading="lazy"
            />
            <Box sx={{ pr: 5 }}>
              <Typography
                sx={{
                  // color: theme.palette.primary.main,
                  fontFamily: "Lato",
                  fontWeight: "bold",
                  mb: 1,
                  fontSize: '16px'
                }}
                variant="button"
              >
                Hua Mei Beauty Center
              </Typography>
              <br/>
              <Typography sx={{ fontFamily: "Lato" }} variant="subtitle1">
                Admin Panel
              </Typography>
            </Box>
          </Box>
          <Divider align="center" sx={{ my: 3 }}>
            Forgot Password
          </Divider>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                {...register('password')}
                error={!!errors.password}
                sx={{ mb: 2 }}
                fullWidth
                id="password"
                label="Password"
                name="password"
                helperText={errors.password?.message}
            />
            <TextField
                {...register('confirm_password')}
                error={!!errors.confirm_password}
                sx={{ mb: 2 }}
                fullWidth
                id="confirm_password"
                label="Confirm Password"
                name="confirm_password"
                helperText={errors.confirm_password?.message}
            />
            <Link to={'/login'}>
                <Typography variant="caption" sx={{ color: theme.palette.info.dark, float: 'right' }}>
                    Back to login?
                </Typography>
            </Link>
            {
              loading ?
                <LoadingButton
                  fullWidth
                  endIcon={<SendIcon />}
                  loading={Boolean(loading)}
                  loadingPosition="end"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  >
                  <span>Loading</span>
                </LoadingButton>
                :
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                Submit
              </Button>
            }
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;
