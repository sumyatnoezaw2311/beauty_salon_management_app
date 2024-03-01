import './App.css';
import AppRouters from './router/AppRouter';
import { ThemeProvider } from '@mui/material';
import theme from './utils/theme';
import { Provider } from 'react-redux';
import { appStore } from './store/store';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <Provider store={appStore}>
      <ThemeProvider theme={theme}>
        <AppRouters/>
        <ToastContainer></ToastContainer>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
