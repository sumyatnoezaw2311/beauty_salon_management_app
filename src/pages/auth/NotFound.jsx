import React from 'react';
import notFound from '../../assets/images/notFound.jpg';
import { Box, ImageList, ImageListItem, Typography } from '@mui/material';

const NotFound = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant='h4' color='textSecondary' gutterBottom>
        Oops! Page not found
      </Typography>
      <Typography variant='body1' color='textSecondary' paragraph>
        The page you are looking for might be in another galaxy.
      </Typography>
      <ImageList sx={{ maxWidth: 600, width: '100%', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ImageListItem>
          <img
            src={notFound}
            alt='Not Found'
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </ImageListItem>
      </ImageList>
    </Box>
  );
};

export default NotFound;
