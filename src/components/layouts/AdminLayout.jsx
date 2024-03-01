import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import ApplicationBar from '../main/AppBar';
import SideBar from '../main/SideBar';
import theme from '../../utils/theme';

const AdminLayout = (props) => {
  const drawerWidth = 260;

  return (
    <Box sx={{
      display: 'flex',
      position: 'fixed',
      bgcolor: theme.palette.background.main,
      width: '100vw',
      height: '100vh',
    }}>
      <CssBaseline />
      <SideBar drawerWidth={drawerWidth}></SideBar>
      <Box sx={{
        width: '100%',
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        overflowY: 'auto',
        height: '100vh',
      }}>
        <ApplicationBar drawerWidth={drawerWidth}></ApplicationBar>
        <Box sx={{
          ml: { sm: `${drawerWidth-5}px` },
          p: { sm: `10px 13px` },
          flex: 1,
          position: 'relative'
        }}>
          {props.children}
        </Box>
      </Box>
    </Box>
  );
}

export default AdminLayout;
