import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite';
import NoDataAlert from '../utils/NoDataAlert';

const PopularItems = ({items}) => {
  return (
      <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Best Seller Items</Typography>
            <Link to="/items" underline="hover" component={Button} color="primary">
              <Typography sx={{ fontSize: { md: '12px', xl: '14px'} }} color="primary">View all...</Typography>
            </Link>
          </Box>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              {items && items.length > 0 ?
              items.map((item, index) => (
              <ListItem key={index}>
                  <ListItemAvatar>
                      <Avatar className='gradiant2'>
                          <FavoriteIcon  />
                      </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={item.item_name} secondary={`${item.total_quantity} sold out`} />
              </ListItem>
              )) :
              <Box sx={{ pt: 2 }}>
                <NoDataAlert content={"There is no items."}></NoDataAlert>
              </Box>
            }
          </List>
      </Box>
  )
}

export default PopularItems