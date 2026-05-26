import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setUser } from "../redux/slices/authSlice";
import api from "../api/axios";

function Login() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "auth.emailRequired";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "auth.invalidEmailFormat";
    }

    if (!password) {
      newErrors.password = "auth.passwordRequired";
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
        setApiError(t("auth.invalidResponse"));
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      dispatch(setUser(user));
      navigate("/");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        setApiError(err.response?.data?.message || t("auth.loginFailed"));
      } else {
        setApiError(t("auth.loginFailed"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0b3b24] flex justify-center items-center min-h-screen px-4 font-sans selection:bg-[#ea580c] selection:text-white">
      <div className="bg-[#0b3b24] text-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-[#144f33] transition-all duration-300">
        <h2 className="text-3xl font-extrabold mb-2 text-center tracking-wide font-serif">
          {t("auth.welcomeBack")}
        </h2>
        <p className="text-gray-400 text-sm text-center mb-8">
          {t("auth.signinSubtitle")}
        </p>

        {apiError && (
          <div className="mb-6 p-3 bg-red-900/40 border border-red-700 text-red-200 rounded-xl text-sm text-center font-medium animate-shake">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-semibold tracking-wide text-gray-200">
              {t("auth.emailAddress")}
            </label>
            <input
              type="email"
              className={`w-full px-4 py-3 bg-[#114b30] text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea580c] transition-all placeholder-gray-500 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#1a5f3e]"
              }`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1.5 font-medium px-1">
                ⚠️ {t(errors.email)}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold tracking-wide text-gray-200">
              {t("auth.password")}
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
                ⚠️ {t(errors.password)}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ea580c] text-white py-3 px-4 rounded-full font-bold tracking-wide shadow-md hover:bg-[#d94e06] active:scale-[0.99] disabled:bg-gray-600 disabled:text-gray-400 disabled:scale-100 transition-all duration-200 flex justify-center items-center mt-8 text-base"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              t("auth.signIn")
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#1a5f3e] text-center text-sm text-gray-400">
          {t("auth.dontHaveAccount")}
          <Link
            to="/register"
            className="text-[#ea580c] font-bold hover:underline ml-1"
          >
            {t("auth.registerHere")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
