import { Navigate, Outlet } from 'react-router-dom';

interface User {
  role: string;
}

function AdminRoute() {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    return <Navigate to="/" replace />;
  }

  const user: User = JSON.parse(userStr) as User;
  
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
