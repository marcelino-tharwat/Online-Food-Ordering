import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "outline" | "ghost" | "link" | "badge";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-orange text-white shadow-md shadow-orange-900/30 hover:shadow-lg hover:shadow-orange-900/40 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100",
  outline:
    "border border-border-medium text-text-secondary hover:text-text-primary hover:border-border-strong hover:bg-white/5 active:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed",
  ghost:
    "text-text-secondary hover:text-text-primary hover:bg-white/5 active:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed",
  link: "text-brand-orange hover:text-brand-orange-light underline-offset-2 hover:underline disabled:opacity-40 p-0 h-auto",
  badge:
    "bg-white/5 text-text-secondary border border-border-light hover:bg-white/10 hover:text-text-primary disabled:opacity-40",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-xs rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-7 py-3.5 text-base rounded-xl gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      fullWidth = false,
      children,
      disabled,
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50 ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : icon ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
