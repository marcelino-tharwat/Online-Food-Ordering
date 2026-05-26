import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

function PrivateRoute() {
  // Check BOTH Redux state AND localStorage token for robustness
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem('token');

  // Debug logging
  console.log('[PrivateRoute] Auth state:', { isAuthenticated, user, token: !!token });

  // Allow access if either Redux state says authenticated OR token exists in localStorage
  const isAuth = isAuthenticated || !!token;


  if (!isAuth) {
    console.log('[PrivateRoute] Not authenticated, redirecting to login');
    return <Navigate to='/login' replace />;
  }

  console.log('[PrivateRoute] Authenticated, allowing access');
  return <Outlet />;
}

export default PrivateRoute;
