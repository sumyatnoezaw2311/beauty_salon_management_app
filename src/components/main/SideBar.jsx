import React from 'react'
import { Box, Drawer, List, Typography } from '@mui/material';
import huaMeiLogo from '../../assets/images/hua_mei_logo.png'
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreIcon from '@mui/icons-material/Store';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WidgetsIcon from '@mui/icons-material/Widgets';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DvrIcon from '@mui/icons-material/Dvr';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SideBarItem from './SideBarItem';
import Groups2Icon from '@mui/icons-material/Groups2';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DescriptionIcon from '@mui/icons-material/Description';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import theme from '../../utils/theme';
import { useParams } from "react-router-dom";

const SideBar = ({ drawerWidth }) => {

    const { id } = useParams()

    const menuSections = [
        { title: "Dashboard", link: "", icon: <DashboardIcon /> },
        { title: "Shops List", link: "shops-list", icon: <StoreIcon /> },
        { title: "Sales & Services", link: "sales-and-services", link2: 'create-sale-voucher', link3: `sale-voucher-detail/${id}`, icon: <ReceiptIcon /> },
        { title: "Purchases", link: "purchases", link2: 'create-purchase-voucher', link3: `purchase-voucher-detail/${id}`, icon: <ShoppingCartIcon /> },
        { title: "Items", link: "items", link2: `stock-detail/${id}`, icon: <WidgetsIcon /> },
        { title: "Services", link: "services", icon: <FaceRetouchingNaturalIcon /> },
        { title: "Customers", link: "customers", icon: <Groups2Icon /> },
        { title: "Members", link: "members", icon: <HandshakeIcon /> },
        { title: "Staff", link: "staff", link2: 'create-new-staff', link3: `staff-detail/${id}`, icon: <PeopleAltIcon /> },
        { title: "Attendance", link: "attendance", icon: <DvrIcon /> },
        { title: "Salary", link: "salary", icon: <AttachMoneyIcon /> },
        { title: "Salary Advance", link: "cash-advance", icon: <LocalAtmIcon /> },
        { title: "Expenses", link: "expenses", icon: <BarChartIcon /> },
        { title: "Report", link: "report", icon: <DescriptionIcon /> },
        { title: "User Management", link: "user-management", link2: `permission-controls-for-user/${id}`, icon: <ManageAccountsIcon /> },
    ]

    return (
        <>
            <Drawer variant="permanent" sx={{ '.MuiDrawer-paper': { width: drawerWidth }, }} open>
                <Box>
                    <Box sx={{ display: 'flex', pl: 2, pt: 3}}>
                        <img
                            height={70}
                            src={`${huaMeiLogo}`}
                            alt={"Hua Mei"}
                            loading="lazy"
                        />
                        <Box sx={{py: 1, px: 2}}>
                            <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold', fontFamily: 'Lato', fontSize: 20, pb: 1}}>ဟွားမိန်</Typography>
                            <Typography>Beauty Center</Typography>
                        </Box>
                    </Box>
                    <List>
                        {
                            menuSections.map((section, index) => <SideBarItem key={index} section={section}></SideBarItem>)
                        }
                    </List>
                </Box>
            </Drawer>
        </>
    )
}

export default SideBar
