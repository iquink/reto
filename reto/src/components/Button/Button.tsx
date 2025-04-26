import styles from "./Button.module.css";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger"; // Add more variants as needed
}

function Button({ children, variant = "primary", ...props }: ButtonProps) {
  return (
    <button className={styles[variant]} {...props}>
      {children}
    </button>
  );
}

export default Button;
