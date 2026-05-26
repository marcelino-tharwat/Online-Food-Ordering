// import { Link } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import type { RootState } from '../redux/store';
// import { logout } from '../redux/slices/authSlice';
// import { selectCartItemCount } from '../redux/slices/cartSlice';

// function Navbar() {
//   const dispatch = useDispatch();
//   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
//   const cartItemCount = useSelector(selectCartItemCount);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     dispatch(logout());
//     window.location.href = '/';
//   };
//   return (
//     <nav className='bg-blue-600 text-white p-4'>
//       <div className='container mx-auto flex justify-between items-center'>
//         <Link to='/' className='text-xl font-bold'>Electro Pi</Link>
//         <div className='flex space-x-4 items-center'>
//           <Link to='/menu' className='hover:underline'>Menu</Link>
//           {isAuthenticated && user ? (
//             <>
//               <Link to='/cart' className='relative hover:underline flex items-center'>
//                 Cart
//                 {cartItemCount > 0 && (
//                   <span className='ml-1.5 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
//                     {cartItemCount > 99 ? '99+' : cartItemCount}
//                   </span>
//                 )}
//               </Link>
//               <Link to='/orders' className='hover:underline'>Orders</Link>
//               {user.role === 'admin' && (
//                 <Link to='/admin' className='hover:underline font-bold'>Admin Panel</Link>
//               )}
//               <span className='opacity-75'>({user.name})</span>
//               <button
//                 onClick={handleLogout}
//                 className='hover:underline'
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to='/login' className='hover:underline'>Login</Link>
//               <Link to='/register' className='hover:underline'>Register</Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
import { selectCartItemCount } from "../redux/slices/cartSlice";
import LanguageSwitcher from "./LanguageSwitcher";

function Navbar() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const cartItemCount = useSelector(selectCartItemCount);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    window.location.href = "/";
  };

  return (
    <nav className="bg-[#ea580c] text-white shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-8 py-4 flex flex-col gap-3 md:gap-0 md:flex-row justify-between items-center">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-wider italic font-serif flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="text-yellow-300">🍕</span>
            {t("navbar.brand")}
          </Link>

          <div className="flex flex-wrap items-center gap-4 font-medium text-sm md:text-base tracking-wide">
            <Link
              to="/menu"
              className="hover:text-yellow-200 transition-colors duration-200"
            >
              {t("navbar.menu")}
            </Link>
            {isAuthenticated && user && (
              <>
                <Link
                  to="/cart"
                  className="relative hover:text-yellow-200 flex items-center transition-colors duration-200 gap-1"
                >
                  <span>{t("navbar.cart")}</span>
                  {cartItemCount > 0 && (
                    <span className="bg-white text-[#ea580c] text-xs font-black rounded-full h-5 w-5 flex items-center justify-center shadow-sm animate-pulse">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/orders"
                  className="hover:text-yellow-200 transition-colors duration-200"
                >
                  {t("navbar.orders")}
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold hover:bg-yellow-300 transition-all shadow-sm"
                  >
                    {t("navbar.adminPanel")}
                  </Link>
                )}
                <span className="bg-[#c2410c] px-3 py-1 rounded-full text-xs font-semibold opacity-90 border border-[#9a3412]">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="hover:text-yellow-200 text-sm opacity-90 hover:opacity-100 transition-all font-semibold"
                >
                  {t("navbar.logout")}
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="hover:text-yellow-200 transition-colors duration-200"
                >
                  {t("navbar.login")}
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-[#ea580c] px-4 py-1.5 rounded-full font-bold shadow-sm hover:bg-yellow-100 transition-all duration-200"
                >
                  {t("navbar.register")}
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end w-full md:w-auto">
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
