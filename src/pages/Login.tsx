// import { useState, type FormEvent } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { setUser } from '../redux/slices/authSlice';
// import api from '../api/axios';

// function Login() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
//   const [apiError, setApiError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const validate = () => {
//     const newErrors: { email?: string; password?: string } = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!email) {
//       newErrors.email = 'Email is required';
//     } else if (!emailRegex.test(email)) {
//       newErrors.email = 'Invalid email format';
//     }

//     if (!password) {
//       newErrors.password = 'Password is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setApiError('');

//     if (!validate()) return;

//     setIsLoading(true);
//     try {
//       const response = await api.post('/auth/login', { email, password });
//       const responseData = response.data;

//       // Handle both wrapped { data: { token, user } } and unwrapped { token, user } responses
//       const token = responseData?.token ?? responseData?.data?.token;
//       const user = responseData?.user ?? responseData?.data?.user;

//       if (!token || !user) {
//         setApiError('Invalid response from server');
//         setIsLoading(false);
//         return;
//       }

//       localStorage.setItem('token', token);
//       dispatch(setUser(user));
//       navigate('/');
//     } catch (error: unknown) {
//       if (error && typeof error === 'object' && 'response' in error) {
//         const err = error as { response?: { data?: { message?: string } } };
//         setApiError(err.response?.data?.message || 'Login failed');
//       } else {
//         setApiError('Login failed');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
//         {apiError && (
//           <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
//             {apiError}
//           </div>
//         )}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block mb-2">Email</label>
//             <input
//               type="email"
//               className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//           </div>
//           <div className="mb-4">
//             <label className="block mb-2">Password</label>
//             <input
//               type="password"
//               className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : ''}`}
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
//           </div>
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
//           >
//             {isLoading ? 'Loading...' : 'Login'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;
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
    // الخلفية الـ Off-white الدافية المريحة للعين المستوحاة من الجزء السفلي للصورة
    <div className="bg-[#0b3b24] flex justify-center items-center min-h-screen px-4 font-sans selection:bg-[#ea580c] selection:text-white">
      {/* الكارد واخد درجة الأخضر الغامق الملكي عشان يظهر بقوة فوق الخلفية الفاتحة */}
      <div className="bg-[#0b3b24] text-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-[#144f33] transition-all duration-300">
        {/* عنوان الصفحة بشكل جذاب ونظيف */}
        <h2 className="text-3xl font-extrabold mb-2 text-center tracking-wide font-serif">
          {currentLang === "ar" ? "مرحباً بك مجدداً" : "Welcome Back"}
        </h2>
        <p className="text-gray-400 text-sm text-center mb-8">
          {currentLang === "ar"
            ? "سجل دخولك لتستمتع بأشهى الوجبات"
            : "Sign in to discover premium flavors"}
        </p>

        {/* معالجة أخطاء الـ API بتصميم متناسق مع الألوان الداكنة */}
        {apiError && (
          <div className="mb-6 p-3 bg-red-900/40 border border-red-700 text-red-200 rounded-xl text-sm text-center font-medium animate-shake">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* حقل البريد الإلكتروني */}
          <div>
            <label className="block mb-2 text-sm font-semibold tracking-wide text-gray-200">
              {currentLang === "ar" ? "البريد الإلكتروني" : "Email Address"}
            </label>
            <input
              type="email"
              className={`w-full px-4 py-3 bg-[#114b30] text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea580c] transition-all placeholder-gray-500 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#1a5f3e]"
              }`}
              placeholder={
                currentLang === "ar" ? "اسمك@مثال.كوم" : "you@example.com"
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1.5 font-medium px-1">
                ⚠️ {errors.email}
              </p>
            )}
          </div>

          {/* حقل كلمة المرور */}
          <div>
            <label className="block mb-2 text-sm font-semibold tracking-wide text-gray-200">
              {currentLang === "ar" ? "كلمة المرور" : "Password"}
            </label>
            <input
              type="password"
              className={`w-full px-4 py-3 bg-[#114b30] text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea580c] transition-all placeholder-gray-500 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#1a5f3e]"
              }`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1.5 font-medium px-1">
                ⚠️ {errors.password}
              </p>
            )}
          </div>

          {/* زر تسجيل الدخول - برتقالي صريح بـ Hover ناعم وحواف دائرية كاملة (Rounded-full) */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ea580c] text-white py-3 px-4 rounded-full font-bold tracking-wide shadow-md hover:bg-[#d94e06] active:scale-[0.99] disabled:bg-gray-600 disabled:text-gray-400 disabled:scale-100 transition-all duration-200 flex justify-center items-center mt-8 text-base"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : currentLang === "ar" ? (
              "تسجيل الدخول"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* رابط التوجيه لصفحة التسجيل الجديدة إذا لم يكن لديه حساب */}
        <div className="mt-8 pt-6 border-t border-[#1a5f3e] text-center text-sm text-gray-400">
          {currentLang === "ar" ? "ليس لديك حساب؟ " : "Don't have an account? "}
          <Link
            to="/register"
            className="text-[#ea580c] font-bold hover:underline ml-1"
          >
            {currentLang === "ar" ? "أنشئ حساباً الآن" : "Register here"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
