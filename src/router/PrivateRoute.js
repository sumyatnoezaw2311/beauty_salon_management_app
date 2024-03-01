import { Navigate, Outlet } from 'react-router-dom'
import { authName } from '../utils/config';


const PrivateRoutes = ()=>{
    let auth = Boolean(localStorage.getItem(authName));

    return  (
        auth ? <Outlet/> : <Navigate to={'/login'}/>
    )
}

export default PrivateRoutes