import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { BeatLoader } from 'react-spinners';
import theme from '../../utils/theme';
import { useLocation } from 'react-router-dom';

const AsyncAutoComplete = ({ selectedOption, options, setSelectedOption, placeholder, error, setSearchText, loading, size }) => {

    const path = useLocation().pathname
    const [ Loading,setLoading ] = useState(null)

    useEffect(()=>{
      setLoading(loading)
    },[loading])

  return (
    <Autocomplete
      // size={path.includes('/attendance') || path.includes('/salary') ? "small" : size ? size : 'medium'}
      size={size ? size : path.includes('/attendance') || path.includes('/salary') ? 'small' : 'medium'}
      value={selectedOption}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(event, newValue) => {
        setSelectedOption(newValue);
      }}
      options={options}
      getOptionLabel={(option) => option.name || option.service}
      renderInput={(params) => (
        <TextField
            onChange={(e)=> setSearchText(e.target.value) }   
            {...params}
            error={!!error}
            helperText={error?.message}
            label={placeholder}
            InputProps={{
                ...params.InputProps,
                endAdornment: (
                    <React.Fragment>
                        {Loading ? <BeatLoader size={10} color={theme.palette.grey[400]} /> : null}
                        {params.InputProps.endAdornment}
                    </React.Fragment>
                ),
            }}
        />
      )}
    />
  );
};

export default AsyncAutoComplete;
