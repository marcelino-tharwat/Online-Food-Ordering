import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { z } from "zod";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Mail, Lock, User, AlertCircle, CheckCircle, UserPlus } from "lucide-react";

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
      name: z.string().min(3, t("validation.nameRequired")),
      email: z.string().email(t("validation.invalidEmail")),
      password: z.string().min(6, t("validation.passwordMinLength")),
      confirmPassword: z.string().min(1, t("validation.confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("validation.passwordsMismatch"),
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-surface-mint">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary mb-2">
            {t("auth.createAccount")}
          </h2>
          <p className="text-text-secondary text-sm">
            {t("auth.joinSubtitle")}
          </p>
        </div>

        <div className="bg-white border border-border-light rounded-2xl p-6 md:p-8 shadow-sm">
          {apiError && (
            <div className="mb-5 p-3 bg-error-bg border border-error-border text-error-text rounded-md text-xs font-medium flex items-center gap-2" role="alert">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {apiError}
            </div>
          )}
          {successMessage && (
            <div className="mb-5 p-3 bg-success-bg border border-success/20 text-success-text rounded-md text-xs font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label={t("auth.name")}
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              icon={<User className="w-4 h-4" />}
              name="name"
            />

            <Input
              type="email"
              label={t("auth.emailAddress")}
              placeholder="example@mail.com"
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

            <Input
              type="password"
              label={t("auth.confirmPassword")}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              icon={<Lock className="w-4 h-4" />}
              name="confirmPassword"
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isLoading}
              icon={<UserPlus className="w-4 h-4" />}
              className="mt-2"
            >
              {t("auth.signup")}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border-light text-center text-sm text-text-secondary">
            {t("auth.alreadyHaveAccount")}{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:text-primary-hover transition-colors"
            >
              {t("auth.loginHere")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
