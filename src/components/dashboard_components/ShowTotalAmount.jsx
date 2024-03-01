import { Box, Avatar, alpha, Typography, useTheme } from "@mui/material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CountUp from 'react-countup';
import { format } from "date-fns";

const ShowTotalBox = ({ avatarClass, title, amount }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.common.white,
        p: { xs: '10px', sm: '15px', md: '20px' },
        borderRadius: '10px',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Avatar
          className={avatarClass}
          sx={{
            width: { xs: '40px', sm: '50px' },
            height: { xs: '40px', sm: '50px' },
            marginRight: { xs: 0, sm: '10px' },
          }}
        >
          <AttachMoneyIcon sx={{ fontSize: { xs: '30px', sm: '40px' } }} />
        </Avatar>
        <Typography variant="subtitle1">{format(new Date(),'dd-MM-yyyy')}</Typography>
      </Box>
      <Typography
        sx={{ pt: { xs: '15px', sm: '30px' }, color: alpha(theme.palette.dark.main, 0.5) }}
      >
        {title}
      </Typography>
      <Typography sx={{ pt: '20px', fontSize: { xs: '18px', sm: '24px', lg: '26px' } }}>
        <CountUp end={amount} /> MMK
      </Typography>
    </Box>
  );
};

export default ShowTotalBox;
