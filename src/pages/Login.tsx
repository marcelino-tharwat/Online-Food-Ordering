import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setUser } from "../redux/slices/authSlice";
import api from "../api/axios";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Mail, Lock, AlertCircle, LogIn } from "lucide-react";

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
      newErrors.email = t("auth.emailRequired");
    } else if (!emailRegex.test(email)) {
      newErrors.email = t("auth.invalidEmailFormat");
    }
    if (!password) {
      newErrors.password = t("auth.passwordRequired");
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black font-serif tracking-tight mb-2">
            {t("auth.welcomeBack")}
          </h2>
          <p className="text-text-secondary text-sm">
            {t("auth.signinSubtitle")}
          </p>
        </div>

        <div className="bg-surface-card border border-border-light rounded-2xl p-6 md:p-8 shadow-lg">
          {apiError && (
            <div className="mb-5 p-3 bg-error-bg border border-error-border text-error-text rounded-xl text-xs font-medium flex items-center gap-2 animate-shake" role="alert">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label={t("auth.emailAddress")}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail className="w-4 h-4" />}
              name="email"
            />

            <Input
              type="password"
              label={t("auth.password")}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<Lock className="w-4 h-4" />}
              name="password"
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isLoading}
              icon={<LogIn className="w-4 h-4" />}
              className="mt-2"
            >
              {t("auth.signIn")}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border-light text-center text-sm text-text-secondary">
            {t("auth.dontHaveAccount")}{" "}
            <Link
              to="/register"
              className="text-brand-orange font-bold hover:text-brand-orange-light transition-colors"
            >
              {t("auth.registerHere")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
