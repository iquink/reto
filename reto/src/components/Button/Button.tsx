import styles from "./Button.module.css";
import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { useTheme } from "../../context/ThemeContext/index";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger"; // Add more variants as needed
  ariaLabel?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, variant = "primary", ariaLabel, disabled, className, ...props },
    ref
  ) => {
    const { prefersReducedMotion } = useTheme();

    // Generate proper aria attributes for accessibility
    const ariaAttributes = {
      "aria-disabled": disabled ? true : undefined,
      "aria-label": ariaLabel,
      role: "button",
      tabIndex: disabled ? -1 : 0,
    };

    // Add reduced motion class if needed
    const buttonClasses = [
      styles[variant],
      prefersReducedMotion ? styles.reducedMotion : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled}
        {...ariaAttributes}
        {...props}
      >
        {children}
      </button>
    );
  }
);

// Add display name for better debugging in React DevTools
Button.displayName = "Button";

export default Button;
