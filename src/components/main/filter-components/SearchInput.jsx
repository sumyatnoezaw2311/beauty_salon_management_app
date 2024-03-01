import React from 'react';
import { FormControl, InputAdornment, OutlinedInput, alpha } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import theme from '../../../utils/theme';
import { useNavigate } from 'react-router-dom';

const SearchInput = ({ searchText, placeholderText }) => {

  const navigate = useNavigate()
  const onSearchChange = (event)=>{
    setTimeout(()=>{
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('keyword', event.target.value);
      navigate(`?${searchParams.toString()}`);
    },[1000])
  }

  return (
    <FormControl variant="outlined">
      <OutlinedInput
        sx={{ width: 300 }}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon sx={{ color: alpha(theme.palette.dark.main, 0.5) }} />
          </InputAdornment>
        }
        size='small'
        placeholder={placeholderText || "Search"}
        value={searchText}
        onChange={onSearchChange}
      />
    </FormControl>
  );
};

export default SearchInput;
