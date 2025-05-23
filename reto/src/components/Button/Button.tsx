import styles from "./Button.module.css";
import { ReactNode, forwardRef } from "react";
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
  /** Content to be rendered inside the button */
  children: ReactNode;

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
      ariaLabel,
      isDisabled,
      className,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion } = useTheme();

    /**
     * Generate aria attributes for the button.
     */
    const ariaAttributes = {
      "aria-label": ariaLabel,
      tabIndex: isDisabled ? -1 : 0,
    };

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

export { Button };
