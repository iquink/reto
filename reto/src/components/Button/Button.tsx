import styles from "./Button.module.css";
import { forwardRef } from "react";
import { useTheme } from "../../context/ThemeContext/index";
import {
  Button as AriaButton,
  ButtonProps as RACButtonProps,
} from "react-aria-components";
import clsx from "clsx";
import React from "react";

/**
 * Button component props interface.
 *
 * @interface ButtonProps
 * @extends {RACButtonProps} - Extends React Aria Components button props
 */
interface ButtonProps extends RACButtonProps {
  /**
   * Visual style variant of the button
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "danger" | "icon";

  /**
   * Accessible label for the button
   * @example "Close dialog" or "Submit form"
   */
  ariaLabel?: string;
}

/**
 * Accessible button component with different visual variants.
 *
 * @component
 * @example
 * ```tsx
 * // Primary button (default)
 * <Button>Submit</Button>
 * ```
 *
 * @example
 * ```tsx
 * // Secondary button
 * <Button variant="secondary">Cancel</Button>
 * ```
 *
 * @example
 * ```tsx
 * // Icon button
 * <Button variant="icon" ariaLabel="Close"><MdClose /></Button>
 * ```
 *
 * @example
 * ```tsx
 * // Icon button with text
 * <Button variant="icon" ariaLabel="Location"><MdLocationOn /> Location</Button>
 * ```
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      className,
      ariaLabel,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion } = useTheme();

    /**
     * Computes the final className by combining variant styles, reduced motion preference,
     * and any custom classNames provided by the consumer.
     */
    const computedClassName = clsx(
      styles[variant],
      prefersReducedMotion && styles.reducedMotion,
      className
    );

    return (
      <AriaButton
        ref={ref}
        className={computedClassName}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </AriaButton>
    );
  }
);

// Add display name for better debugging in React DevTools
Button.displayName = "Button";

export { Button };
