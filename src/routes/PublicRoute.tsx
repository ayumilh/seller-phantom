import { Navigate } from "react-router-dom";
import { utilsservice } from "../services/utilsService"


interface PublicRoute {
    children: JSX.Element
}
export function PublicRoute({children}: PublicRoute){
    const token = utilsservice.getTokenValido();

    if(token) { return <Navigate to={'/'} replace/>};

    return children;
}