import React from "react";
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
import { Link, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../slices/authSlice";
import { LoadingButton } from "@mui/lab";
import SendIcon from '@mui/icons-material/Send';

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
});
  
const ForgotPassword = () => {
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

  const onSubmit = async (data)=>{
    localStorage.setItem('huamei_forgot_email', data.email)
    await dispatch(forgotPassword({ method: 'post', data: data }))
    navigate('/login')
  }

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
                {...register('email')}
                error={!!errors.email}
                sx={{ mb: 2 }}
                fullWidth
                id="email"
                label="Email"
                name="email"
                helperText={errors.email?.message}
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

export default ForgotPassword;
