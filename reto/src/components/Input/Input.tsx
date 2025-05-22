import styles from "./Input.module.css";
import React, { forwardRef, ReactNode } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  TextField,
  Label,
  Input as AriaInput,
  TextFieldProps,
  FieldError,
} from "react-aria-components";
import { FieldValues, FieldError as RHFFieldError } from "react-hook-form";
import clsx from "clsx";

interface InputProps extends TextFieldProps, FieldValues {
  /** Name of the input field */
  name: string;

  /** Value of the input field */
  value?: string | undefined;

  /** Whether the input is invalid */
  invalid?: boolean;

  /** Visible label for the input */
  label: string;

  /** Placeholder text for the input field */
  placeholder?: string;

  /** Whether the input is disabled */
  isDisabled?: boolean;

  /** Custom class name */
  className?: string;

  /** Aria-label for screen readers if label is visually hidden */
  ariaLabel?: string;

  /** Optional error object for the input field */
  error?: RHFFieldError | undefined;

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
      name,
      value,
      invalid,
      label,
      placeholder,
      errorMessage,
      isDisabled,
      className,
      ariaLabel,
      error,
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

    const onValueChange = (value: string) => {
      onChange?.(value);
    };

    return (
      <TextField
        isDisabled={isDisabled}
        aria-label={ariaLabel}
        name={name}
        value={value}
        onChange={(e) => onValueChange(e)}
        validationBehavior="aria"
        isInvalid={invalid}
        {...props}
        className={styles.componentWrapper}
      >
        <Label className={styles.label}>{label}</Label>
        <div className={styles.inputWrapper}>
          <AriaInput
            ref={ref}
            placeholder={placeholder}
            className={inputClassName}
          />
          {children && <div className={styles.icon}>{children}</div>}
        </div>
        <FieldError className={styles.errorMessage}>
          {error?.message}
        </FieldError>
      </TextField>
    );
  }
);

Input.displayName = "Input";

export { Input };
