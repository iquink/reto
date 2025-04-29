import styles from "./Button.module.css";
import { ReactNode, forwardRef } from "react";
import { useTheme } from "../../context/ThemeContext/index";
import {
  Button as AriaButton,
  ButtonProps as RACButtonProps,
} from "react-aria-components";
import clsx from "clsx";
import React from "react";

interface ButtonProps extends RACButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger"; // Add more variants as needed
  ariaLabel?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      ariaLabel,
      isDisabled,
      className,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion } = useTheme();

    // Generate proper aria attributes for accessibility
    const ariaAttributes = {
      "aria-label": ariaLabel,
      tabIndex: isDisabled ? -1 : 0,
    };

    // Add reduced motion class if needed
    const computedClassName = clsx(
      styles[variant],
      prefersReducedMotion && styles.reducedMotion,
      className
    );

    return (
      <AriaButton
        ref={ref}
        className={computedClassName}
        isDisabled={isDisabled}
        {...ariaAttributes}
        {...props}
      >
        {children}
      </AriaButton>
    );
  }
);

// Add display name for better debugging in React DevTools
Button.displayName = "Button";

export default Button;
