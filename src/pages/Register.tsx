import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { z } from "zod";

function Register() {
  const { t } = useTranslation();
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

  const registerSchema = z
    .object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      email: z.string().email("Invalid email"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z
        .string()
        .min(6, "Password must be at least 6 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });

  const validateForm = () => {
    const result = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const formErrors: typeof errors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof errors;
        formErrors[field] = issue.message;
      });

      setErrors(formErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      setSuccessMessage(t("auth.registrationSuccessful"));
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        setApiError(
          err.response?.data?.message || t("auth.registrationFailed"),
        );
      } else {
        setApiError(t("auth.registrationFailed"));
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
          {t("auth.createAccount")}
        </h2>
        <p className="text-gray-400 text-sm text-center mb-8">
          {t("auth.joinSubtitle")}
        </p>

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
          <div>
            <label className="block mb-1.5 text-sm font-semibold tracking-wide text-gray-200">
              {t("auth.name")}
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2.5 bg-[#114b30] text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea580c] transition-all placeholder-gray-500 ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#1a5f3e]"
              }`}
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1 font-medium px-1">
                ⚠️ {t(errors.name)}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-semibold tracking-wide text-gray-200">
              {t("auth.emailAddress")}
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
                ⚠️ {t(errors.email)}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-semibold tracking-wide text-gray-200">
              {t("auth.password")}
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
                ⚠️ {t(errors.password)}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-semibold tracking-wide text-gray-200">
              {t("auth.confirmPassword")}
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
                ⚠️ {t(errors.confirmPassword)}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ea580c] text-white py-3 px-4 rounded-full font-bold tracking-wide shadow-md hover:bg-[#d94e06] active:scale-[0.99] disabled:bg-gray-600 disabled:text-gray-400 disabled:scale-100 transition-all duration-200 flex justify-center items-center mt-6 text-base"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              t("auth.signup")
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#1a5f3e] text-center text-sm text-gray-400">
          {t("auth.alreadyHaveAccount")}
          <Link
            to="/login"
            className="text-[#ea580c] font-bold hover:underline ml-1"
          >
            {t("auth.loginHere")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
