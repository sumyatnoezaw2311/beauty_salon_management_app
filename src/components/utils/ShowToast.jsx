import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ShowToast = (type,message) => {
  toast[type](message, {
    position: "bottom-right",
    autoClose: type === 'warning' ? 3000 : 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored"
  });
};
