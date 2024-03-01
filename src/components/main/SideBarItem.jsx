import { useNavigate, useLocation } from 'react-router-dom';
import { Box, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import theme from '../../utils/theme';
import React from 'react';


const SideBarItem = ({ section }) => {

    const location = useLocation()
    const path = location.pathname
    const navigate = useNavigate()

    const parts = path.split('/');

    let lastPart;
    if (parts[3]) {
        lastPart = parts[2] + '/' + parts[3];
    } else {
        lastPart = parts[parts.length - 1];
    }

    const handleOnClick = (link) => {
        navigate(`/${link}`)
    }

    return <>
        <ListItem sx={{ px: 0 }} key={section.title}>
            <ListItemButton onClick={() => handleOnClick(section.link)}>
                {lastPart === section.link || lastPart === section.link2 || lastPart === section.link3 ? <Box sx={{
                    width: '8px',
                    height: '30px',
                    ml: '-20px',
                    mr: '12px',
                    bgcolor: theme.palette.primary.main,
                    borderRadius: '0px 5px 5px 0px'
                }}></Box> : <Box></Box>}
                {React.cloneElement(section.icon, {
                    style: lastPart === section.link || lastPart === section.link2 || lastPart === section.link3
                        ? { color: theme.palette.primary.main }
                        : {}
                })}
                <ListItemText primary={<Typography variant='p' sx={lastPart === section.link || lastPart === section.link2 || lastPart === section.link3 ? { color: theme.palette.primary.main, fontWeight: 'bold', fontFamily: 'Poppins', px: 3, fontSize: '14px' } : { fontFamily: 'Poppins', px: 3, fontSize: '14px' }} >{section.title}</Typography>}></ListItemText>
            </ListItemButton>
        </ListItem>
    </>
}

export default SideBarItem