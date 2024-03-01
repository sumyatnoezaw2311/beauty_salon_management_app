import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

const AppPagination = ({pageCount})=>{

  const [ currentPage,setCurrentPage ] = React.useState(1)
  const navigate = useNavigate()

  const handleChange = (event, value) => {
    setCurrentPage(value)
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('page', value);
    navigate(`?${searchParams.toString()}`);
  };

  React.useEffect(()=>{
    const searchParams = new URLSearchParams(window.location.search);
    const prevPage = searchParams.get('page');
    setCurrentPage(prevPage)
  },[window.location.search])

  return (
    <Stack spacing={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 5 }}>
      <Pagination page={Number(currentPage) || 1} onChange={handleChange} color='primary' count={pageCount} variant="outlined" shape="rounded" />
    </Stack>
  );
}

export default AppPagination