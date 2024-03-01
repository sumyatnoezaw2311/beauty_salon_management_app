import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import NoDataAlert from '../utils/NoDataAlert';

const PopularServices = ({services}) => {
  return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Popular Services</Typography>
            <Link to="/services" underline="hover" component={Button} color="primary">
              <Typography sx={{ fontSize: { md: '12px', xl: '14px'} }} color="primary">View all...</Typography>
            </Link>
        </Box>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {services && services.length > 0 ?
              services.map((service, index) => (
              <ListItem key={index}>
                  <ListItemAvatar>
                      <Avatar className='gradiant2'>
                          <FaceRetouchingNaturalIcon  />
                      </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={service.service_name} secondary={`${service.total_quantity} appointment`} />
              </ListItem>
              )):
              <Box sx={{ pt: 2 }}>
                <NoDataAlert content={"There is no service."}></NoDataAlert>
              </Box>
            }
          </List>
      </Box>
  )
}

export default PopularServices