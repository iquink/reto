import styles from "./Switch.module.css";
import React, { forwardRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  Switch as AriaSwitch,
  SwitchProps as AriaSwitchProps,
} from "react-aria-components";
import clsx from "clsx";

/**
 * Switch component props interface.
 *
 * @interface SwitchProps
 * @extends {AriaSwitchProps} - Extends React Aria Components switch props
 */
interface SwitchProps extends AriaSwitchProps {
  /** Label for the switch */
  label: string;

  /** Custom class name */
  className?: string;

  /** Is component used for theme switching */
  isThemeSwitch?: boolean;
}

/**
 * Accessible switch component with theme-aware styling.
 *
 * @component
 * @example
 * ```tsx
 * <Switch label="Enable notifications" isThemeSwitch={true} />
 * ```
 */
const Switch = forwardRef<HTMLLabelElement, SwitchProps>(
  ({ label, className, isDisabled, isThemeSwitch, ...props }, ref) => {
    const { prefersReducedMotion } = useTheme();

    const switchClassName = clsx(
      styles.switch,
      isDisabled && styles.disabled,
      prefersReducedMotion && styles.reducedMotion,
      isThemeSwitch && styles.themeSwitch,
      className
    );

    return (
      <AriaSwitch
        ref={ref}
        isDisabled={isDisabled}
        {...props}
        className={switchClassName}
      >
        <span className={styles.indicator} />
        {label}
      </AriaSwitch>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;
