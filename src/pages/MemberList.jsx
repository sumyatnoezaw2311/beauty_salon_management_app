import * as React from 'react';
import { Box, ImageListItem, ImageListItemBar, Paper, Tab, Tabs, Typography, alpha, Button} from "@mui/material"
import whiteBg from '../assets/images/whiteBg.jpg'
import SearchInput from "../components/main/filter-components/SearchInput";
import theme from "../utils/theme";
import DateFilters from "../components/main/filter-components/DateFilters";
import AppPagination from '../components/main/filter-components/AppPagination';
import { useDispatch, useSelector } from 'react-redux';
import { getMembershipRec } from '../slices/membershipSlice';
import { changeDateTime } from '../utils/changeDateTime'
import CreateNewMember from '../components/customer_components/CreateNewMember';
import { IMG_BASE_URL } from '../utils/config';
import MemberDialog from '../components/utils/MemberDialog';
import { useLocation } from 'react-router-dom';
import AsyncAutoComplete from '../components/utils/AsyncAutoComplete';
import { getAllCus } from '../slices/customerSlice';
import Loading from '../components/utils/Loading';
import NoDataAlert from '../components/utils/NoDataAlert';

const MemberList = () => {

    const dispatch = useDispatch()
    const { search } = useLocation()
    const [ value, setValue ] = React.useState(0);
    const [ searchTextCus,setSearchTextCus ] = React.useState("")
    const [ customer,setCustomer ] = React.useState(null)
    const [ showCode,setShowCode ] = React.useState(null)
    const [ showDate,setShowDate ] = React.useState(null)
    const [ showCodeDialog, setShowCodeDialog ] = React.useState(false)
    const { memberships : membershipsList, loading } = useSelector(state=> state.Membership)
    const [openCreateMemberDialog, setOpenCreateMemberDialog] = React.useState(false);
    const { customers: customers, loading: customersLoading } = useSelector(state=> state.Customer)

    const fetchCustomers = async ()=>{
      await dispatch(getAllCus({ method: 'get', data: null, keyword: searchTextCus }))
    }

    const fetchData = async()=>{
        await dispatch(getMembershipRec({ method: 'get', data: null, cusId: customer?.id || null }))
    }

    const renderUsages = (time,recs) => {
        const tabs = [];      
        for (let i = 0; i < time; i++) {
          tabs.push(
            <Tab
              onClick={()=>{
                if(recs[i]){
                  setShowCode(recs[i].code);
                  setShowDate(recs[i].usedAt)
                  setShowCodeDialog(true)
                }                
              }}
              key={i}
              label={
                <Box>
                  <ImageListItem key={`Subheader-${i}`}>
                    <Paper
                      elevation={3}
                      sx={{
                        border: '1px solid',
                        borderColor: alpha(theme.palette.common.black, 0.3),
                        borderRadius: '10px',
                      }}
                    >
                      <img
                        src={recs[i]?.image ? `${IMG_BASE_URL}/${recs[i].image}` : whiteBg }
                        style={{
                          width: '150px',
                          height: 'auto',
                          borderRadius: '10px',
                        }}
                        alt={`Signature-${i}`}
                      />
                    </Paper>
                  </ImageListItem>
                  <ImageListItemBar
                    title={<Typography variant="body1">{recs[i] && recs[i].code}</Typography>}
                    subtitle={<Typography variant="body2">{recs[i] && `${changeDateTime(recs[i].usedAt)}`}</Typography>}
                    sx={{
                      borderBottomLeftRadius: '10px',
                      borderBottomRightRadius: '10px',
                    }}
                  ></ImageListItemBar>
                </Box>
              }
              sx={{ p: 0, mx: 1 }}
            />
          );
        }
        return tabs;
    };    

    React.useEffect(()=>{
        fetchData()
    },[search,customer])

    React.useEffect(()=>{
      fetchCustomers()
  },[searchTextCus])

    return (
        <Box sx={{
            bgcolor: theme.palette.common.white,
            borderRadius: '10px',
            height: '100%',
            pb: 5
        }}>
            { loading && <Loading/> }
            <MemberDialog open={showCodeDialog} setOpen={setShowCodeDialog} code={showCode} date={showDate}></MemberDialog>
            <CreateNewMember open={openCreateMemberDialog} setOpen={setOpenCreateMemberDialog} />
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 3
            }}>
                <Button variant='contained' onClick={()=> setOpenCreateMemberDialog(true) } sx={{ height: '100%' }}>Buy Membership</Button>
                <DateFilters />
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ width: 200, mr: 2 }}>
                    <AsyncAutoComplete size={'small'} loading={customersLoading} setSearchText={setSearchTextCus} selectedOption={customer} setSelectedOption={setCustomer} options={customers?.data || []} placeholder={'Select Customer'} error={null}/>
                  </Box>
                  <SearchInput placeholderText={"Search by service name"}/>
                </Box>
            </Box>
                <Box sx={{ height: '70vh', overflowY: 'scroll', px: 3 }}>
                {
                  (membershipsList && membershipsList.data && membershipsList.data.length > 0) ?
                    membershipsList.data.map((membership,index)=>
                        <Tabs key={index} value={value}
                            sx={{ mb: 2 }}
                            variant="scrollable"
                            scrollButtons
                            allowScrollButtonsMobile
                            aria-label="scrollable force tabs example"
                            TabIndicatorProps={{
                                style: {
                                    display: 'none'
                                },
                            }}
                        >
                            <Tab label={
                                <Paper elevation={3} sx={{ p: 1 ,border: '1px solid', borderColor: alpha(theme.palette.common.black, 0.3), borderRadius: '10px' , width: '150px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <Typography sx={{ textAlign: 'left', fontWeight: 'bold', textTransform: 'capitalize' }}>{membership.customerName}</Typography>
                                    <Typography sx={{ textAlign: 'left', fontSize: '12px', textTransform: 'capitalize' }}>{membership.service}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                        <Typography sx={{ textAlign: 'left', fontSize: '12px', textTransform: 'capitalize' }}>Price</Typography>
                                        <Typography sx={{ textAlign: 'left', fontSize: '12px' }}>{membership.price}MMK</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                        <Typography sx={{ textAlign: 'left', fontSize: '12px',textTransform: 'capitalize' }}>Usage</Typography>
                                        <Typography sx={{ textAlign: 'left', fontSize: '12px' }}>{`${membership.usedTime}/ ${membership.time}`} Times</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                        <Typography sx={{ textAlign: 'left', fontSize: '12px' }}>{changeDateTime(membership.date)}</Typography>
                                    </Box>
                                </Paper>
                            } sx={{ p: 0, mx: 1 }} />
                            {
                                renderUsages(membership.time, membership.membershipRecordDetail)
                            }
                        </Tabs>
                    ):
                    <NoDataAlert content={"There is no memberships"}></NoDataAlert>
                }
                </Box>
            <AppPagination pageCount={membershipsList?.meta?.last_page}/>
        </Box>
    )
}

export default MemberList