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
import type { RootState } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
import { selectCartItemCount } from "../redux/slices/cartSlice";

function Navbar() {
  const dispatch = useDispatch();
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
    // تغيير الخلفية للبرتقالي الدافئ (Orange-600) والخط أبيض ناصع زي الهيدر في الصورة
    <nav className="bg-[#ea580c] text-white shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        {/* اللوجو أو اسم البراند بخط عريض ومميز مائل قليلاً يعبر عن الأكل والشغف */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wider italic font-serif flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="text-yellow-300">🍕</span>
          {localStorage.getItem("lang") === "ar" ? "شغف وحب" : "Passion & Love"}
        </Link>

        {/* الروابط والقوائم */}
        <div className="flex space-x-6 items-center font-medium text-sm md:text-base tracking-wide">
          {/* تم استبدال الـ underline التقليدي بـ hover ناعم يغير الشفافية أو اللون */}
          <Link
            to="/menu"
            className="hover:text-yellow-200 transition-colors duration-200"
          >
            {localStorage.getItem("lang") === "ar" ? "القائمة" : "Menu"}
          </Link>

          {isAuthenticated && user ? (
            <>
              {/* العربة بتصميم متناسق مع النوتيفيكيشن الدائرية */}
              <Link
                to="/cart"
                className="relative hover:text-yellow-200 flex items-center transition-colors duration-200 gap-1"
              >
                <span>
                  {localStorage.getItem("lang") === "ar" ? "السلة" : "Cart"}
                </span>
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
                {localStorage.getItem("lang") === "ar" ? "الطلبات" : "Orders"}
              </Link>

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold hover:bg-yellow-300 transition-all shadow-sm"
                >
                  {localStorage.getItem("lang") === "ar"
                    ? "لوحة التحكم"
                    : "Admin Panel"}
                </Link>
              )}

              {/* اسم المستخدم بتنسيق خفيف ومميز */}
              <span className="bg-[#c2410c] px-3 py-1 rounded-full text-xs font-semibold opacity-90 border border-[#9a3412]">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="hover:text-yellow-200 text-sm opacity-90 hover:opacity-100 transition-all font-semibold"
              >
                {localStorage.getItem("lang") === "ar" ? "خروج" : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-yellow-200 transition-colors duration-200"
              >
                {localStorage.getItem("lang") === "ar" ? "دخول" : "Login"}
              </Link>
              <Link
                to="/register"
                className="bg-white text-[#ea580c] px-4 py-1.5 rounded-full font-bold shadow-sm hover:bg-yellow-100 transition-all duration-200"
              >
                {localStorage.getItem("lang") === "ar" ? "تسجيل" : "Register"}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
