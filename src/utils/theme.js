import { createTheme } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    typography: {
      fontFamily: 'Poppins',
      engFont: 'Poppins'
    },
    primary: {
      main: '#F00000',
      // main: 'ff0066',
    },
    secondary: {
      main: '#4FCD7A'
    },
    warning: {
        main: '#FFC107'
    },
    success: {
        main: '#8CD867'
    },
    info: {
      main: '#6742BB'
    },
    danger: {
        main: '#EF4444'
    },
    common: {
        white: '#ffffff',
        purple: '#6742BB',
        green: '#24828B',
        blue: '#31C6D4'
    },
    dark: {
      main: '#000000',
      secondary: '#D14D72'
    },
    background: {
      main: '#F1E4C3'
    }
  },
});

export default theme;
