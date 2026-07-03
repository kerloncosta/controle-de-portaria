import { Navigate } from 'react-router-dom';

interface PrivateRoutesProps {
  children: JSX.Element;
  allowedRoles: number[]; 
}

export function PrivateRoutes({ children, allowedRoles }: PrivateRoutesProps) {
  const userString = localStorage.getItem('user');
  
  if (!userString) {
    return <Navigate to="/" />;
  }

  const user = JSON.parse(userString);

  const userRole = Number(user.role);

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />; 
  }

  return children;
}