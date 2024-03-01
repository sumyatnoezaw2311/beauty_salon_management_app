import React from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import huameiLogo from "../../assets/images/hua_mei_logo.png";
import theme from "../../utils/theme";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "../../slices/authSlice";
import { LoadingButton } from "@mui/lab";
import SendIcon from '@mui/icons-material/Send';

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(8, "Password must be at least 8 characters").max(8, "Password must be minimum 8 characters").required('Password is required'),
});
  
const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loading = useSelector(state=> state.Auth.loading)

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data)=>{
    await dispatch(authenticate({ method: 'post', data: data }))
    navigate('/')
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
            User Login
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
            <FormControl sx={{ width: "100%", mb: 2 }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                {...register('password')}
                error={!!errors.password}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              <FormHelperText sx={{ color: theme.palette.danger.main }}>{errors.password?.message}</FormHelperText>
            </FormControl>
            <Link to={'/forgot-password'}>
                <Typography variant="caption" sx={{ color: theme.palette.info.dark, float: 'right' }}>
                    Forgot password?
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
                Log In
              </Button>
            }
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
