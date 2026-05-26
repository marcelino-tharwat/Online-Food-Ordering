// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { cartService } from "../services/cartService";
// import {
//   setCartItems, optimisticUpdateQuantity, optimisticRemoveItem,
//   setLoading,
//   setError,
//   clearCart,
//   type CartItem,
//   type LocalizedText,
// } from "../redux/slices/cartSlice";
// import type { RootState, AppDispatch } from "../redux/store";
// import { Trash2, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react";

// function Cart() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { cartItems, loading, error, total } = useSelector(
//     (state: RootState) => state.cart,
//   );
//   const [actionLoading, setActionLoading] = useState<string | null>(null);
//   const currentLang = localStorage.getItem("lang") || "en";
//   const getLocalizedText = (obj: LocalizedText | undefined): string => {
//     if (!obj) return "";
//     return currentLang === "ar" ? obj.ar : obj.en;
//   };

//   useEffect(() => {
//     fetchCart();
//   }, [dispatch]);

//   const fetchCart = async () => {
//     try {
//       dispatch(setLoading(true));
//       dispatch(setError(null));
//       const cartData = await cartService.getCart();
//       dispatch(setCartItems(cartData));
//     } catch (err) {
//       dispatch(setError("Failed to load cart"));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   const handleUpdateQuantity = async (productId: string, quantity: number) => {
//     if (quantity < 1) return;
//     setActionLoading(productId);
//     try {
//       dispatch(setLoading(true));
//       dispatch(setError(null));
//       await cartService.updateCart(productId, quantity);
//       await fetchCart();
//     } catch (err) {
//       dispatch(setError("Failed to update quantity"));
//     } finally {
//       dispatch(setLoading(false));
//       setActionLoading(null);
//     }
//   };

//   const handleRemoveItem = async (productId: string) => {
//     setActionLoading(productId);
//     try {
//       dispatch(setLoading(true));
//       dispatch(setError(null));
//       await cartService.removeFromCart(productId);
//       await fetchCart();
//     } catch (err) {
//       dispatch(setError("Failed to remove item"));
//     } finally {
//       dispatch(setLoading(false));
//       setActionLoading(null);
//     }
//   };

//   const handleClearCart = async () => {
//     try {
//       dispatch(setLoading(true));
//       dispatch(setError(null));
//       await cartService.clearCart();
//       dispatch(clearCart());
//     } catch (err) {
//       dispatch(setError("Failed to clear cart"));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   const computedTotal = (cartItems || []).reduce(
//     (sum, item) => sum + item.product.price * item.quantity,
//     0,
//   );

//   if (loading && (cartItems || []).length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
//           <p className="text-gray-600">Loading your cart...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && (cartItems || []).length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-600 text-lg mb-4">{error}</p>
//           <button
//             onClick={fetchCart}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if ((cartItems || []).length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
//           <h2 className="text-2xl font-semibold text-gray-700 mb-2">
//             Your Cart is Empty
//           </h2>
//           <p className="text-gray-500 mb-6">
//             Looks like you have not added anything to your cart yet.
//           </p>
//           <a
//             href="/menu"
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
//           >
//             Browse Menu
//           </a>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
//             {error}
//           </div>
//         )}

//         <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
//           <div className="divide-y divide-gray-200">
//             {(cartItems || []).map((item: CartItem) => (
//               <div
//                 key={item.product._id}
//                 className="p-6 flex items-center gap-6"
//               >
//                 <img
//                   src={item.product.image || "/placeholder.png"}
//                   alt={getLocalizedText(item.product.name)}
//                   className="w-24 h-24 object-cover rounded-lg bg-gray-100"
//                 />

//                 <div className="flex-1">
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     {getLocalizedText(item.product.name)}
//                   </h3>
//                   <p className="text-gray-600 mt-1"></p>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() =>
//                       handleUpdateQuantity(item.product._id, item.quantity - 1)
//                     }
//                     disabled={
//                       actionLoading === item.product._id || item.quantity <= 1
//                     }
//                     className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <Minus className="w-4 h-4" />
//                   </button>

//                   <span className="w-12 text-center font-medium">
//                     {item.quantity}
//                   </span>

//                   <button
//                     onClick={() =>
//                       handleUpdateQuantity(item.product._id, item.quantity + 1)
//                     }
//                     disabled={actionLoading === item.product._id}
//                     className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <Plus className="w-4 h-4" />
//                   </button>
//                 </div>

//                 <div className="text-lg font-semibold text-gray-800 w-24 text-right"></div>

//                 <button
//                   onClick={() => handleRemoveItem(item.product._id)}
//                   disabled={actionLoading === item.product._id}
//                   className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   <Trash2 className="w-5 h-5" />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-md p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold text-gray-800">
//               Order Summary
//             </h2>
//             <div className="text-2xl font-bold text-gray-800">Total:</div>
//           </div>

//           <div className="flex gap-4">
//             <button
//               onClick={handleClearCart}
//               disabled={loading}
//               className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {loading ? (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               ) : (
//                 <Trash2 className="w-4 h-4" />
//               )}
//               Clear Cart
//             </button>

//             <a
//               href="/checkout"
//               className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Proceed to Checkout
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Cart;

import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setUser } from "../redux/slices/authSlice";
import api from "../api/axios";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const currentLang = localStorage.getItem("lang") || "en";

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email =
        currentLang === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email =
        currentLang === "ar"
          ? "صيغة البريد الإلكتروني غير صحيحة"
          : "Invalid email format";
    }

    if (!password) {
      newErrors.password =
        currentLang === "ar" ? "كلمة المرور مطلوبة" : "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const responseData = response.data;

      const token = responseData?.token ?? responseData?.data?.token;
      const user = responseData?.user ?? responseData?.data?.user;

      if (!token || !user) {
        setApiError(
          currentLang === "ar"
            ? "استجابة غير صالحة من السيرفر"
            : "Invalid response from server",
        );
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      dispatch(setUser(user));
      navigate("/");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        setApiError(
          err.response?.data?.message ||
            (currentLang === "ar" ? "فشل تسجيل الدخول" : "Login failed"),
        );
      } else {
        setApiError(currentLang === "ar" ? "فشل تسجيل الدخول" : "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // الخلفية الكريمية الناعمة كأساس للصفحة بأكملها
    <div className="bg-[#0b3b24] flex justify-center items-center min-h-screen px-4 font-sans text-[#0b3b24]">
      {/* الكارد بدون خلفية بيضاء فاقعة، فقط شادو خفيف جداً، لدمجه مع الخلفية */}
      <div className="p-8 md:p-12 rounded-3xl w-full max-w-lg transition-all duration-300">
        {/* الهيدر النظيف */}
        <div className="text-center mb-12">
          <span className="text-5xl block mb-3">🍕</span>
          <h2 className="text-3xl md:text-4xl font-black font-serif tracking-wide">
            {currentLang === "ar" ? "أهلاً بك مجدداً!" : "Welcome Back!"}
          </h2>
          <p className="text-[#0b3b24]/80 text-sm mt-2">
            {currentLang === "ar"
              ? "سجل دخولك لتكتشف نكهاتنا المميزة"
              : "Sign in to discover premium flavors"}
          </p>
        </div>

        {apiError && (
          <div className="mb-8 p-4 bg-red-100/60 border border-red-300 text-red-700 rounded-2xl text-sm text-center font-medium">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* حقل البريد الإلكتروني - مدمج بنعومة */}
          <div>
            <label className="block mb-2 text-sm font-semibold tracking-wide px-1">
              {currentLang === "ar" ? "البريد الإلكتروني" : "Email Address"}
            </label>
            <input
              type="email"
              className={`w-full px-5 py-4 bg-white/60 border rounded-2xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ea580c] focus:border-transparent transition-all placeholder-[#0b3b24]/40 ${
                errors.email
                  ? "border-red-400 focus:ring-red-400"
                  : "border-[#0b3b24]/10"
              }`}
              placeholder={
                currentLang === "ar" ? "اسمك@مثال.كوم" : "you@example.com"
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 font-medium px-1">
                ⚠️ {errors.email}
              </p>
            )}
          </div>

          {/* حقل كلمة المرور - مدمج بنعومة */}
          <div>
            <label className="block mb-2 text-sm font-semibold tracking-wide px-1">
              {currentLang === "ar" ? "كلمة المرور" : "Password"}
            </label>
            <input
              type="password"
              className={`w-full px-5 py-4 bg-white/60 border rounded-2xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ea580c] focus:border-transparent transition-all placeholder-[#0b3b24]/40 ${
                errors.password
                  ? "border-red-400 focus:ring-red-400"
                  : "border-[#0b3b24]/10"
              }`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 font-medium px-1">
                ⚠️ {errors.password}
              </p>
            )}
          </div>

          {/* زر تسجيل الدخول بلون البراند (البرتقالي الدافئ) */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ea580c] text-white py-4 px-4 rounded-full font-bold tracking-wide shadow-lg shadow-orange-600/10 hover:bg-[#d94e06] active:scale-[0.99] disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none transition-all duration-200 flex justify-center items-center mt-10 text-lg"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : currentLang === "ar" ? (
              "دخول"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-[#0b3b24]/10 text-center text-sm text-[#0b3b24]/70">
          {currentLang === "ar" ? "ليس لديك حساب؟ " : "Don't have an account? "}
          <Link
            to="/register"
            className="text-[#ea580c] font-bold hover:text-[#d94e06] transition-colors ml-1"
          >
            {currentLang === "ar" ? "أنشئ حساباً الآن" : "Register here"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
