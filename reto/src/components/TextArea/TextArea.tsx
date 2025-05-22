import styles from "./TextArea.module.css";
import React, { forwardRef, ReactNode } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  TextArea as AriaTextArea,
  Label,
  TextField,
  TextFieldProps,
  FieldError,
} from "react-aria-components";
import { FieldValues, FieldError as RHFFieldError } from "react-hook-form";
import clsx from "clsx";

interface TextAreaProps extends TextFieldProps, FieldValues {
  /** Name of the textarea field */
  name: string;

  /** Value of the textarea field */
  value?: string | undefined;

  /** Whether the textarea is invalid */
  invalid?: boolean;

  /** Visible label for the textarea */
  label: string;

  /** Placeholder text for the textarea field */
  placeholder?: string;

  /** Whether the textarea is disabled */
  isDisabled?: boolean;

  /** Custom class name */
  className?: string;

  /** Aria-label for screen readers if label is visually hidden */
  ariaLabel?: string;

  /** Optional error object for the textarea field */
  error?: RHFFieldError | undefined;

  /** Children for future extensibility (e.g., icons) */
  children?: ReactNode;

  /** Change event handler */
  onChange?: (value: string) => void;
}

/**
 * Accessible and theme-aware TextArea component
 *
 * @component
 * @example
 * ```tsx
 * <TextArea label="Description" placeholder="Enter your description" />
 * ```
 */
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
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

    const textAreaClassName = clsx(
      styles.textArea,
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
        <div className={styles.textAreaWrapper}>
          <AriaTextArea
            ref={ref}
            placeholder={placeholder}
            className={textAreaClassName}
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

TextArea.displayName = "TextArea";

export { TextArea };
