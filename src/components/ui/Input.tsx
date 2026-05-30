import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";

type InputVariant = "default" | "error";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
  inputVariant?: InputVariant;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      icon,
      fullWidth = true,
      inputVariant = error ? "error" : "default",
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || props.name;

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm font-semibold tracking-wide text-text-secondary"
          >
            {label}
          </label>
        )}

        <div className="relative group">
          {icon && (
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-text-tertiary group-focus-within:text-brand-orange transition-colors duration-200">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`w-full px-4 py-3 bg-surface-card text-text-primary rounded-xl border transition-all duration-200 placeholder:text-text-tertiary/60 font-medium
              ${
                inputVariant === "error"
                  ? "border-error/60 focus:border-error focus:ring-2 focus:ring-error/20"
                  : "border-border-medium focus:border-brand-orange/50 focus:ring-2 focus:ring-brand-orange/10 hover:border-border-strong"
              }
              ${icon ? "ps-11" : ""}
              ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-error-text text-xs mt-1.5 font-medium flex items-center gap-1.5 px-1"
            role="alert"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-text-tertiary text-xs mt-1.5 px-1">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, type InputProps };
