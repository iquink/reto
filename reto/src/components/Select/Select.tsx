import styles from "./Select.module.css";
import React, { forwardRef, ReactNode } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  SelectProps as AriaSelectProps,
  Label,
  ListBoxItem,
  Button as AriaButton,
  Popover,
  ListBox,
  FieldError,
} from "react-aria-components";
import { FieldError as RHFFieldError } from "react-hook-form";
import clsx from "clsx";

interface Option {
  value: number | string;
  label: string;
  icon?: ReactNode;
}

interface SelectProps extends Omit<AriaSelectProps, "children"> {
  name: string;
  label?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  className?: string;
  icon?: ReactNode;
  error?: RHFFieldError | undefined;
}

/**
 * Select component using react-aria-components and design system styling.
 *
 * Renders an accessible, theme-aware select dropdown with support for icons, error display,
 * react-hook-form integration, and custom options. Uses design system variables for styling.
 *
 * @remarks
 * - Integrates with react-hook-form for form validation and error display.
 * - Supports custom icons for both the select button and individual options.
 * - Fully accessible and keyboard-navigable.
 * - Uses design system variables and CSS modules for consistent styling.
 *
 * @example
 * ```tsx
 * <Select
 *   name="status"
 *   label="Status"
 *   options={[{ value: 'open', label: 'Open' }, { value: 'closed', label: 'Closed' }]}
 *   value={selectedStatus}
 *   onChange={setSelectedStatus}
 *   error={formState.errors.status}
 * />
 * ```
 *
 * @param props - {@link SelectProps} for configuring the select component.
 * @returns The rendered Select component.
 */
const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      name,
      label,
      options,
      value,
      onChange,
      isDisabled,
      className,
      icon,
      error,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion } = useTheme();
    const selectClassName = clsx(
      styles.select,
      isDisabled && styles.disabled,
      prefersReducedMotion && styles.reducedMotion,
      className
    );
    return (
      <AriaSelect
        name={name}
        selectedKey={value}
        onSelectionChange={(key) => onChange?.(String(key))}
        isDisabled={isDisabled}
        className={styles.componentWrapper}
        {...props}
      >
        {label && <Label className={styles.label}>{label}</Label>}
        <AriaButton ref={ref} className={selectClassName}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <AriaSelectValue className={styles.selectedValue} />
          <span aria-hidden="true" className={styles.selectArrow}>▼</span>
        </AriaButton>
        {error?.message && (
          <FieldError className={styles.errorMessage}>
            {error.message}
          </FieldError>
        )}
        <Popover className={styles.listBox}>
          <ListBox>
            {options.map((opt) => (
              <ListBoxItem id={opt.value} key={opt.value} className={styles.option} textValue={opt.label}>
                {opt.icon && (
                  <span className={styles.optionIcon}>{opt.icon}</span>
                )}
                {opt.label}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </AriaSelect>
    );
  }
);

Select.displayName = "Select";

export { Select };
