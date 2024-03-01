import { Box } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import { FadeLoader } from 'react-spinners'
import theme from '../../utils/theme';

const Loading = () => {
    const loadingContainer = document.getElementById('loading-portal');

    return ReactDOM.createPortal(
        <Box sx={{
            height: '100vh',
            display: 'flex',
            width: '100vw',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: 0,
            zIndex: 2000,
            backgroundColor: "rgba(0, 0, 0, 0.5)"
        }}
        >
            <FadeLoader
                color={theme.palette.primary.main}
                speedMultiplier={3}
            />
        </Box>,
        loadingContainer
    );
}

export default Loading