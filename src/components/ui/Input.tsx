import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      icon,
      fullWidth = true,
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
            className="block mb-1.5 text-sm font-semibold text-text-secondary"
          >
            {label}
          </label>
        )}

        <div className="relative group">
          {icon && (
            <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-text-tertiary group-focus-within:text-primary transition-colors duration-200">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`w-full px-3.5 py-2.5 bg-white text-text-primary rounded-md border transition-all duration-200 placeholder:text-text-tertiary/70 font-normal text-sm
              ${error
                ? "border-error/60 focus:border-error focus:ring-2 focus:ring-error/15"
                : "border-border-medium focus:border-primary/50 focus:ring-2 focus:ring-primary/10 hover:border-border-medium"
              }
              ${icon ? "ps-10" : ""}
              ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-error-text text-xs mt-1 font-medium flex items-center gap-1"
            role="alert"
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-text-tertiary text-xs mt-1">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, type InputProps };
