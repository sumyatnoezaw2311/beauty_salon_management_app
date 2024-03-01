import * as React from 'react';
import Grid from '@mui/material/Grid';
import ShowTotalBox from '../components/dashboard_components/ShowTotalAmount';
import ShowTotalCustomer from '../components/dashboard_components/ShowTotalCus';
import FanListTable from '../components/dashboard_components/FanListTable';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardData } from '../slices/dashboardSlice';
import PopularItems from '../components/dashboard_components/PopularItems';
import PopularServices from '../components/dashboard_components/PopularServices';
import theme from '../utils/theme';
import Loading from '../components/utils/Loading';

  const Dashboard = () => {

    const dispatch = useDispatch()
    const { dashboardData,loading } = useSelector(state=> state.Dashboard)

    const fetchDashboardData = async ()=>{
      await dispatch(getDashboardData({ method: 'get' }))
    }

    React.useEffect(()=>{
      fetchDashboardData()
    },[])

    return (
      <>
        {
          loading && <Loading></Loading>
        }
        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item xs={12} sm={6} md={4}>
              <ShowTotalBox
                avatarClass="gradiant1"
                title={'Total Income'}
                amount={dashboardData?.todayIncome || 0}
              />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
              <ShowTotalBox
                avatarClass="gradiant3"
                title={'Total Expense Amount'}
                amount={dashboardData?.todayTotalExpense || 0}
              />
          </Grid>
          <Grid item xs={12} sm={12} md={4} gap={1} sx={{ display: 'flex', flexDirection: 'column' }}>
            <ShowTotalCustomer customerType={'Customers'} quantity={dashboardData?.totalCustomers || 0} />
            <ShowTotalCustomer customerType={'Members'} quantity={dashboardData?.totalMembers || 0} />
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ height: 700 }}
          direction="row"
          justifyContent="space-between"
          alignItems="stretch"
        >
          <Grid item xs={12} md={8}>
              <Box sx={{ borderRadius: '10px', height: '100%' }}>
                <FanListTable customers={dashboardData?.monthlyTopCustomers || []}/>
              </Box>
            </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                bgcolor: theme.palette.common.white,
                borderRadius: '10px',
                height: '100%',
                p: 3
              }}
            >
              <PopularItems items={dashboardData?.popularItems}/>
              <PopularServices services={dashboardData?.popularServices} />
            </Box>
          </Grid>
        </Grid>
      </>
    );
  };

  export default Dashboard;
