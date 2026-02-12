import { Navigate } from 'react-router-dom';
import { utilsservice } from '../services/utilsService';

interface PrivateRouteProps {
  children: JSX.Element;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const token = utilsservice.getTokenValido();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
