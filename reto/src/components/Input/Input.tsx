import styles from "./Input.module.css";
import React, { forwardRef, ReactNode } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  TextField,
  Label,
  Input as AriaInput,
  Text,
  TextFieldProps,
} from "react-aria-components";
import clsx from "clsx";

interface InputProps extends TextFieldProps {
  /** Visible label for the input */
  label: string;

  /** Placeholder text for the input field */
  placeholder?: string;

  /** Optional error message */
  errorMessage?: string;

  /** Whether the input is disabled */
  isDisabled?: boolean;

  /** Custom class name */
  className?: string;

  /** Aria-label for screen readers if label is visually hidden */
  ariaLabel?: string;

  /** Children for future extensibility (e.g., icons) */
  children?: ReactNode;

  /** Change event handler */
  onChange?: (value: string) => void;
}

/**
 * Accessible and theme-aware Input component
 *
 * @component
 * @example
 * ```tsx
 * <Input label="Email" placeholder="Enter your email" />
 * ```
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      errorMessage,
      isDisabled,
      className,
      ariaLabel,
      children,
      onChange,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion } = useTheme();

    const inputClassName = clsx(
      styles.input,
      isDisabled && styles.disabled,
      errorMessage && styles.error,
      prefersReducedMotion && styles.reducedMotion,
      className
    );

    const onValueChange = (value: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(value.target.value);
    };

    return (
      <TextField
        isDisabled={isDisabled}
        aria-label={ariaLabel}
        {...props}
        className={styles.componentWrapper}
      >
        <Label className={styles.label}>{label}</Label>
        <div className={styles.inputWrapper}>
          <AriaInput
            ref={ref}
            placeholder={placeholder}
            className={inputClassName}
            onChange={(e) => onValueChange(e)}
          />
          {children && <div className={styles.icon}>{children}</div>}
        </div>
        {errorMessage && (
          <Text slot="errorMessage" className={styles.errorMessage}>
            {errorMessage}
          </Text>
        )}
      </TextField>
    );
  }
);

Input.displayName = "Input";

export default Input;
