import { Box, Tab, Tabs } from "@mui/material"
import theme from "../utils/theme"
import React, { useState } from 'react';
import StockList from "../components/item_list_components/StockList"
import CategoriesList from "../components/item_list_components/Categories";
import DamageItem from "../components/item_list_components/DamageItem";
import ServiceSupplyItem from "../components/item_list_components/ServiceSupply";

const ItemList = () => {

    const [itemTypeList, setItemTypeList] = useState(
        [
            {
                name: 'Stocks List',
                isSelected: true
            },
            {
                name: 'Categories',
                isSelected: false
            },
            {
                name: 'Damage Item',
                isSelected: false
            },
            {
                name: 'Service Supply',
                isSelected: false
            }
        ]
    )

    let [bodyScreen, updateBodyScreen] = useState(<StockList />);

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        const updatedList = itemTypeList.map((item, index) => ({
            ...item,
            isSelected: newValue === index,
        }));

        let updateScreen = bodyScreen;

        switch (newValue) {
            case 0:
                updateScreen = <StockList />
                break;
            case 1:
                updateScreen = <CategoriesList />
                break;
            case 2:
                updateScreen = <DamageItem />
                break;
            case 3:
                updateScreen = <ServiceSupplyItem />
                break;
            default:
                updateScreen = <Box></Box>
                break;
        }

        updateBodyScreen(updateScreen);

        setItemTypeList(updatedList);
    };

    return (
        <>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="disabled tabs example"
                TabIndicatorProps={{
                    style: {
                        // display: 'none'
                    },
                }}
                sx={{
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    backgroundColor: '#fff',
                    mb: 1
                }}
            >
                {itemTypeList.map((itemType, index) => (
                    <Tab
                        key={index}
                        label={itemType.name}
                        sx={{
                            fontSize: '16px',
                            color: theme.palette.dark.main,
                            textTransform: 'none',
                        }}
                    />
                ))
                }
            </Tabs>
            <Box sx={{
                bgcolor: theme.palette.common.white,
                borderBottomLeftRadius: '10px',
                borderBottomRightRadius: '10px',
                height: '100%'
            }}>
                {bodyScreen}
            </Box>
        </>
    )
}

export default ItemList