import React, { useEffect, useState } from 'react'
import { getAllShops } from '../../slices/shopSlice'
import StoreIcon from '@mui/icons-material/Store';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { authName, setInfoToLocal, shopId, updateShopToLocal } from '../../utils/config';
import { decryptData } from '../../utils/decrypt';

const ShopMenu = () => {

    const dispatch = useDispatch()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const shops = useSelector(state=> state.Shop.shops)
    const [ currentShop,setCurrentShop ] = useState(null)
    
    const fetchShops = async () => {
        await dispatch(getAllShops({ method: 'get', data: null }));
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (selectedShop)=>{
        const existingJson = JSON.parse(decryptData(localStorage.getItem(authName)))
        existingJson.user.shopId = selectedShop.id;
        setInfoToLocal(existingJson)
        setCurrentShop(selectedShop)
        handleClose()
        window.location.reload()
    }
   
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    useEffect(()=>{
        if(shops){
            // if(!shopId()){
            //     updateShopToLocal(shops.data[0].id)
            //     setCurrentShop(shops.data[0])
            // }
            if(shopId()){
                const current = shops.data.find(shop=> shop.id === Number(shopId()))
                setCurrentShop(current)
            }
        }
    },[shops])
    
    useEffect(()=>{
        fetchShops()
    },[])

  return (
        <div style={{ marginLeft: '15px' }}>
            <Button
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="primary"
                variant='contained'
                startIcon={<StoreIcon/>}
            >
                <Typography>{currentShop ? currentShop.name : "Please select the shop"}</Typography>
            </Button>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
            {
                (shops && shops.data.length > 0) ?
                shops.data.map((shop,index)=>
                    <MenuItem key={index} onClick={()=> handleSelect(shop) }>{shop.name}</MenuItem>
                ):
                    <MenuItem>No option</MenuItem>
            }
            </Menu>
        </div>
  )
}

export default ShopMenu