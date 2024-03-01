import React from 'react'
import { Grid,Box } from '@mui/material'
import waitingPng from '../../assets/images/waitingPage.png'


const WaitingPage = () => {
  return (
    <Grid container sx={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <Grid item xs={12} sm={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
                <img
                width={'100%'}
                src={waitingPng}
                loading="lazy"
                />
            </Box>
        </Grid>
    </Grid>
  )
}

export default WaitingPage

