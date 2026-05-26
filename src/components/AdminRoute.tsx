import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

function AdminRoute() {
  // Check BOTH Redux state AND localStorage for robustness
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  // Debug logging
  console.log('[AdminRoute] Auth state:', { isAuthenticated, user, token: !!token });

  // Parse stored user if Redux user is null but localStorage has data
  let effectiveUser = user;
  if (!effectiveUser && storedUser) {
    try {
      effectiveUser = JSON.parse(storedUser);
    } catch {
      // ignore parse errors
    }
  }

  if (!effectiveUser || effectiveUser.role !== 'admin') {
    console.log('[AdminRoute] Not admin, redirecting to home');
    return <Navigate to='/' replace />;
  }

  console.log('[AdminRoute] Admin authenticated, allowing access');
  return <Outlet />;
}

export default AdminRoute;
