// import { useState, type FormEvent } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import api from '../api/axios';

// function Register() {
//   const navigate = useNavigate();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [errors, setErrors] = useState<{
//     name?: string;
//     email?: string;
//     password?: string;
//     confirmPassword?: string;
//   }>({});
//   const [apiError, setApiError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');

//   const validate = () => {
//     const newErrors: typeof errors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!name) {
//       newErrors.name = 'Name is required';
//     }

//     if (!email) {
//       newErrors.email = 'Email is required';
//     } else if (!emailRegex.test(email)) {
//       newErrors.email = 'Invalid email format';
//     }

//     if (!password) {
//       newErrors.password = 'Password is required';
//     } else if (password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     if (!confirmPassword) {
//       newErrors.confirmPassword = 'Confirm password is required';
//     } else if (confirmPassword !== password) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setApiError('');
//     setSuccessMessage('');

//     if (!validate()) return;

//     setIsLoading(true);
//     try {
//       await api.post('/auth/register', { name, email, password });
//       setSuccessMessage('Registration successful! Please login.');
//       setTimeout(() => navigate('/login'), 1500);
//     } catch (error: unknown) {
//       if (error && typeof error === 'object' && 'response' in error) {
//         const err = error as { response?: { data?: { message?: string } } };
//         setApiError(err.response?.data?.message || 'Registration failed');
//       } else {
//         setApiError('Registration failed');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
//         {apiError && (
//           <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
//             {apiError}
//           </div>
//         )}
//         {successMessage && (
//           <div className="mb-4 p-2 bg-green-100 text-green-700 rounded text-sm">
//             {successMessage}
//           </div>
//         )}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block mb-2">Name</label>
//             <input
//               type="text"
//               className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
//               placeholder="Enter your name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
//           </div>
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
//               placeholder="Create a password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
//           </div>
//           <div className="mb-4">
//             <label className="block mb-2">Confirm Password</label>
//             <input
//               type="password"
//               className={`w-full p-2 border rounded ${errors.confirmPassword ? 'border-red-500' : ''}`}
//               placeholder="Confirm your password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//             />
//             {errors.confirmPassword && (
//               <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
//             )}
//           </div>
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
//           >
//             {isLoading ? 'Loading...' : 'Register'}
//           </button>
//         </form>
//         <p className="mt-4 text-center text-sm">
//           Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Register;
import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const currentLang = localStorage.getItem("lang") || "en";

  const validate = () => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
      newErrors.name =
        currentLang === "ar" ? "الاسم مطلوب" : "Name is required";
    }

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
    } else if (password.length < 6) {
      newErrors.password =
        currentLang === "ar"
          ? "يجب أن تكون كلمة المرور 6 أحرف على الأقل"
          : "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword =
        currentLang === "ar"
          ? "تأكيد كلمة المرور مطلوب"
          : "Confirm password is required";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword =
        currentLang === "ar"
          ? "كلمات المرور غير متطابقة"
          : "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    if (!validate()) return;

    setIsLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      setSuccessMessage(
        currentLang === "ar"
          ? "تم إنشاء الحساب بنجاح! جاري تحويلك للوجين..."
          : "Registration successful! Please login.",
      );
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        setApiError(
          err.response?.data?.message ||
            (currentLang === "ar" ? "فشل إنشاء الحساب" : "Registration failed"),
        );
      } else {
        setApiError(
          currentLang === "ar" ? "فشل إنشاء الحساب" : "Registration failed",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // الخلفية الـ Off-white الدافية المريحة المتناسقة مع الـ Layout الأساسي
    <div className="bg-[#0b3b24] flex justify-center items-center min-h-screen px-4 py-12 font-sans selection:bg-[#ea580c] selection:text-white">
      {/* الكارد بالأخضر الداكن الملكي مع حواف دائرية عريضة وشادو ناعم */}
      <div className="bg-[#0b3b24] text-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-[#144f33] transition-all duration-300">
        <h2 className="text-3xl font-extrabold mb-2 text-center tracking-wide font-serif">
          {currentLang === "ar" ? "إنشاء حساب جديد" : "Create Account"}
        </h2>
        <p className="text-gray-400 text-sm text-center mb-8">
          {currentLang === "ar"
            ? "انضم إلينا واستمتع بتجربة طلب طعام فريدة"
            : "Join us to explore and order premium dishes"}
        </p>

        {/* رسائل الخطأ والنجاح بتنسيق متناسق مع الخلفية الداكنة */}
        {apiError && (
          <div className="mb-6 p-3 bg-red-900/40 border border-red-700 text-red-200 rounded-xl text-sm text-center font-medium">
            {apiError}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-3 bg-emerald-950/60 border border-emerald-600 text-emerald-200 rounded-xl text-sm text-center font-medium">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* حقل الاسم */}
          <div>
            <label className="block mb-1.5 text-sm font-semibold tracking-wide text-gray-200">
              {currentLang === "ar" ? "الاسم الكامل" : "Full Name"}
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2.5 bg-[#114b30] text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea580c] transition-all placeholder-gray-500 ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#1a5f3e]"
              }`}
              placeholder={currentLang === "ar" ? "أدخل اسمك" : "John Doe"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1 font-medium px-1">
                ⚠️ {errors.name}
              </p>
            )}
          </div>

          {/* pقل البريد الإلكتروني */}
          <div>
            <label className="block mb-1.5 text-sm font-semibold tracking-wide text-gray-200">
              {currentLang === "ar" ? "البريد الإلكتروني" : "Email Address"}
            </label>
            <input
              type="email"
              className={`w-full px-4 py-2.5 bg-[#114b30] text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea580c] transition-all placeholder-gray-500 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#1a5f3e]"
              }`}
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 font-medium px-1">
                ⚠️ {errors.email}
              </p>
            )}
          </div>

          {/* حقل كلمة المرور */}
          <div>
            <label className="block mb-1.5 text-sm font-semibold tracking-wide text-gray-200">
              {currentLang === "ar" ? "كلمة المرور" : "Password"}
            </label>
            <input
              type="password"
              className={`w-full px-4 py-2.5 bg-[#114b30] text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea580c] transition-all placeholder-gray-500 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#1a5f3e]"
              }`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1 font-medium px-1">
                ⚠️ {errors.password}
              </p>
            )}
          </div>

          {/* حقل تأكيد كلمة المرور */}
          <div>
            <label className="block mb-1.5 text-sm font-semibold tracking-wide text-gray-200">
              {currentLang === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}
            </label>
            <input
              type="password"
              className={`w-full px-4 py-2.5 bg-[#114b30] text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea580c] transition-all placeholder-gray-500 ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#1a5f3e]"
              }`}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1 font-medium px-1">
                ⚠️ {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* زر الإنشاء - برتقالي صريح ومستدير بالكامل لتطابق روح الـ Call to Action بالصورة */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ea580c] text-white py-3 px-4 rounded-full font-bold tracking-wide shadow-md hover:bg-[#d94e06] active:scale-[0.99] disabled:bg-gray-600 disabled:text-gray-400 disabled:scale-100 transition-all duration-200 flex justify-center items-center mt-6 text-base"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : currentLang === "ar" ? (
              "إنشاء الحساب"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* رابط الدخول الفوري لو المستخدم عنده حساب بالفعل */}
        <div className="mt-6 pt-6 border-t border-[#1a5f3e] text-center text-sm text-gray-400">
          {currentLang === "ar"
            ? "لديك حساب بالفعل؟ "
            : "Already have an account? "}
          <Link
            to="/login"
            className="text-[#ea580c] font-bold hover:underline ml-1"
          >
            {currentLang === "ar" ? "سجل دخولك من هنا" : "Login here"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
