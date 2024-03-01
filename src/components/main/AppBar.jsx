import React, { useEffect, useState } from 'react'
import PersonIcon from '@mui/icons-material/Person';
import { Box, Button, Fab, Toolbar, Typography, alpha } from '@mui/material';
import theme from '../../utils/theme';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import ShopMenu from '../utils/ShopMenu';
import { decryptData } from '../../utils/decrypt';
import { authName } from '../../utils/config';
import ProfilePopover from './ProfilePopover';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const ApplicationBar = ({ drawerWidth }) => {

  const { id } = useParams()
  let title = '';
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname
  const parts = path.split('/');
  const [ accountType,setAccountType ] = useState(null)

  let lastPart;
  if(parts[3]) {
    lastPart = parts[2] + '/' + parts[3];
  } else {
    lastPart = parts[parts.length -1];
  }

  switch (lastPart) {
    case '':
      title = 'Hua Mei Admin Dashboard';
      break;
    case 'shops-list':
      title = 'Shops List';
      break;
    case 'sales-and-services':
      title = 'Sales & Services List';
      break;
    case 'create-sale-voucher':
      title = 'Create Voucher';
      break;
    case `sale-voucher-detail/${id}`:
      title = 'Sale Voucher Detail';
      break;
    case 'purchases':
      title = 'Purchases';
      break;
    case 'create-purchase-voucher':
      title = 'Create Voucher';
      break;
    case `purchase-voucher-detail/${id}`:
      title = 'Purchase Voucher Detail';
      break;
    case 'items':
      title = 'Items';
      break;
    case `stock-detail/${id}`:
      title = 'Stock Detail';
      break;
    case 'services':
      title = 'Services';
      break;
    case 'customers':
      title = 'Customers List';
      break;
    case 'members':
      title = 'Members List';
      break;
    case 'staff':
      title = 'Staff List';
      break;
    case 'create-new-staff':
      title = 'Create New Staff';
      break;
    case `staff-detail/${id}`:
      title = 'Staff Detail';
      break;
    case 'attendance':
      title = 'Attendance';
      break;
    case 'salary':
      title = 'Salary';
      break;
    case 'cash-advance':
      title = 'Salary Advance';
      break;
    case 'expenses':
      title = 'Expenses';
      break;
    case 'report':
      title = 'Report';
      break;
    case 'user-management':
      title = 'User Management';
      break;
    case `permission-controls-for-user/${id}`:
      title = 'Permission Controls for User';
      break;
    default:
      title = '';
      break;
  }

  const handleRefresh = ()=>{
    navigate("?page=1")
  }

  useEffect(()=>{
    if(!localStorage.getItem(authName)) return;
    const localData = localStorage.getItem(authName)
    setAccountType(JSON.parse(decryptData(localData)).user.type)
  },[])


  return (
    <Box sx={{
      height: `70px`,
      bgcolor: alpha(theme.palette.common.white, 0.95),
      justifyContent: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 20,
      borderRadius: 0,
    }}>
      <Toolbar sx={{ 
        width: `calc(100% - ${drawerWidth + 30}px)`,
        ml: `${drawerWidth + 5}px`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Typography variant='h6' fontFamily='Poppins'>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ProfilePopover></ProfilePopover>
          {
            accountType === 'owner' &&
            <ShopMenu></ShopMenu>
          }
          <Button onClick={()=> handleRefresh() } variant='contained' color='primary' size='large' sx={{ ml: 2 }} startIcon={<RestartAltIcon/>}>Refresh</Button>
        </Box>
      </Toolbar>
    </Box>
  )
}

export default ApplicationBar
