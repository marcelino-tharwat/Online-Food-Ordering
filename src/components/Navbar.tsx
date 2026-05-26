import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import { selectCartItemCount } from '../redux/slices/cartSlice';

function Navbar() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const cartItemCount = useSelector(selectCartItemCount);


  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    window.location.href = '/';
  };
  return (
    <nav className='bg-blue-600 text-white p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link to='/' className='text-xl font-bold'>Electro Pi</Link>
        <div className='flex space-x-4 items-center'>
          <Link to='/menu' className='hover:underline'>Menu</Link>
          {isAuthenticated && user ? (
            <>
              <Link to='/cart' className='relative hover:underline flex items-center'>
                Cart
                {cartItemCount > 0 && (
                  <span className='ml-1.5 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>
              <Link to='/orders' className='hover:underline'>Orders</Link>
              {user.role === 'admin' && (
                <Link to='/admin' className='hover:underline font-bold'>Admin Panel</Link>
              )}
              <span className='opacity-75'>({user.name})</span>
              <button
                onClick={handleLogout}
                className='hover:underline'
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to='/login' className='hover:underline'>Login</Link>
              <Link to='/register' className='hover:underline'>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
