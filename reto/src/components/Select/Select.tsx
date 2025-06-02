import styles from "./Select.module.css";
import React, { forwardRef, ReactNode } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  Select as AriaSelect,
  SelectProps as AriaSelectProps,
  Label,
  ListBoxItem,
  Button as AriaButton,
  Popover,
  ListBox,
} from "react-aria-components";
import clsx from "clsx";

interface Option {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
}

interface SelectProps extends Omit<AriaSelectProps, "children"> {
  name: string;
  label: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  className?: string;
  icon?: ReactNode;
}

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
        <Label className={styles.label}>{label}</Label>
        <AriaButton ref={ref} className={selectClassName}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <span className={styles.selectedValue}>
            {options.find((opt) => opt.value === value)?.label || label}
          </span>
        </AriaButton>
        <Popover className={styles.listBox}>
          <ListBox>
            {options.map((opt) => (
              <ListBoxItem key={opt.value} className={styles.option}>
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
