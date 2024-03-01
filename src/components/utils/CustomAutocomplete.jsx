import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const CustomAutocomplete = ({ selectedOption, options, setSelectedOption, placeholder, error }) => {
  
  return (
    <Autocomplete
      value={selectedOption}
      isOptionEqualToValue={(option, value) => option.id === value.id }
      onChange={(event, newValue) => {
        setSelectedOption(newValue);
      }}
      options={options}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          error={!!error}
          helperText={error?.message}
          label={placeholder}
        />
      )}
    />
  );
};

export default CustomAutocomplete;
