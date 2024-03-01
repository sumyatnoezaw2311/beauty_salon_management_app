import React,{ useState, useEffect } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { Avatar, Box, Button, alpha } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import theme from '../../utils/theme';
import { authName } from '../../utils/config';
import { decryptData } from '../../utils/decrypt';
import LogoutIcon from '@mui/icons-material/Logout';
import { logOut } from '../../slices/authSlice';
import { useDispatch } from 'react-redux';
import AlertDialog from '../utils/AlertDialog';

const ProfilePopover = ()=>{
    const dispatch = useDispatch()
    const [ showAlert,setShowAlert ] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [ userData,setUserData ] = useState(null)
      
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
      
    const handlePopoverClose = (event) => {
        setAnchorEl(null);
    };
      
    const open = Boolean(anchorEl);
    
    const handleLogout = ()=>{
      setShowAlert(true)
    }

    const handleCancel = ()=>{
      setShowAlert(false)
    }
    
    const handleConfirm = ()=>{
        dispatch(logOut())
        setShowAlert(false)
        window.location.reload()
    }

    useEffect(()=>{
        if(!localStorage.getItem(authName)) return;
        const localData = localStorage.getItem(authName)
        setUserData(JSON.parse(decryptData(localData)).user)
    },[])
      
    return (
          <div>
            <AlertDialog
                toggle={showAlert}
                setToggle={setShowAlert}
                cancel={handleCancel}
                confrim={handleConfirm}
                title={"Are you sure?"}
                content={"You want to logout from this account."}
            ></AlertDialog>
            <Avatar
                sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.2)}}
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                // onMouseLeave={handlePopoverClose}
            >
              <PersonIcon color='primary'/>
            </Avatar>
            <Popover
              id="mouse-over-popover"
            //   sx={{
            //     pointerEvents: 'none',
            //   }}
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
            //   onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
                <Box sx={{ p: 3, width: 300 }}>
                    <Typography variant='h6' sx={{ fontWeight: 'bold' }}>{userData?.name}</Typography>
                    <Typography variant='body2' sx={{ color: alpha(theme.palette.common.black, 0.7)}}>{userData?.position}</Typography>
                    <Typography variant='body2' sx={{ color: alpha(theme.palette.common.black, 0.7), mt: 2 }}>Email</Typography>
                    <Typography variant='body2' sx={{ color: theme.palette.common.black }}>{userData?.email}</Typography>
                    <Button onClick={()=> handleLogout() } size='small' variant='outlined' startIcon={<LogoutIcon/>} sx={{ whiteSpace: 'nowrap', mt: 2 }} fullWidth>Log out</Button>
                </Box>
            </Popover>
          </div>
        );
      }

export default ProfilePopover

