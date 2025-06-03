import React from "react";
import { Form } from "react-aria-components";
import { Input } from "@components";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@components";
// import axios from "axios";
// import authApi from "@api/authApi";
import { useStore } from "@store"; // Import the root store
import { useTranslation } from "react-i18next";
import styles from "./Login.module.css"; // Import the CSS module
// import { useLocation } from "wouter";

/**
 * Login component for user authentication.
 *
 * This component renders a login form with fields for username and password.
 * It uses `react-hook-form` for form validation and `react-aria-components` for accessibility.
 *
 * @component
 * @example
 * ```tsx
 * <Login />
 * ```
 */
const Login: React.FC = () => {
  const { authStore } = useStore();
  const { t } = useTranslation();
  // const [, navigate] = useLocation();
  /**
   * Default form values for the login form.
   */
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * Interface for the form data.
   */
  interface FormData {
    /** Email entered by the user */
    email: string;

    /** Password entered by the user */
    password: string;
  }

  /**
   * Handles form submission.
   *
   * @param data - The form data containing email and password.
   */
  const onSubmit = async (data: FormData): Promise<void> => {
    const result = await authStore.login(data.email, data.password);
    if (result.success) {
      console.log("Login successful!");
      reset(); // Reset the form after submission
    } else {
      alert(result.message);
      console.error("Login failed:", result);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Controller
        control={control}
        name="email"
        rules={{
          required: t("pages.login.form.validation.email.required"),
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: t("pages.login.form.validation.email.invalid"),
          },
        }}
        render={({
          field: { name, value, onChange, onBlur, ref },
          fieldState: { invalid, error },
        }) => (
          <Input
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            ref={ref}
            label={t("pages.login.form.email")}
            placeholder={t("pages.login.form.placeholder.email")}
            invalid={invalid}
            error={error}
            className={styles.input}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        rules={{
          required: t("pages.login.form.validation.password.required"),
        }}
        render={({
          field: { name, value, onChange, onBlur, ref },
          fieldState: { invalid, error },
        }) => (
          <Input
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            ref={ref}
            label={t("pages.login.form.password")}
            type="password"
            placeholder={t("pages.login.form.placeholder.password")}
            invalid={invalid}
            error={error}
            className={styles.input}
          />
        )}
      />
      <Button type="submit" className={styles.button}>
        {t("pages.login.form.submit")}
      </Button>
    </Form>
  );
};

export default Login;
