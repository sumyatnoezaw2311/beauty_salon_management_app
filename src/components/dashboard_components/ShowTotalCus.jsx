import React, { useState, useEffect } from "react";
import CountUp from 'react-countup';
import { Avatar, Box, Typography, alpha, useTheme } from "@mui/material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { formatCountNum } from "../../utils/formatCountNum";

const ShowTotalCustomer = ({ customerType, quantity }) => {
  const [qty, setQty] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    setQty(quantity);
  }, [quantity]);

  return (
    <Box
      sx={{
        bgcolor: theme.palette.common.white,
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '100%',
        alignItems: 'center',
        px: { xs: 2, sm: 3, md: 5 },
        py: { xs: 2, sm: 3 },
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Avatar
          className="gradiant4"
          sx={{
            width: { xs: '40px', sm: '50px' },
            height: { xs: '40px', sm: '50px' },
          }}
        >
          <PeopleAltIcon
            sx={{
              fontSize: { xs: '20px', sm: '30px' },
            }}
          />
        </Avatar>
        <Typography sx={{ pl: { xs: '10px', sm: '20px' }, color: alpha(theme.palette.dark.main, 0.5) }}>
          {customerType}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: { xs: '18px', sm: '24px', lg: '26px' } }}>
        <CountUp end={qty} formattingFn={formatCountNum} />
      </Typography>
    </Box>
  );
}

export default ShowTotalCustomer;
