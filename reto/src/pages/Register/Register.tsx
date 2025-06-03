import React from "react";
import { Form } from "react-aria-components";
import { Input } from "@components";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@components";
import styles from "./Register.module.css"; // Import the CSS module
import { authApi } from "@api/index"; // Import the authApi for registration
import { useTranslation } from "react-i18next";

/**
 * Register component for user registration.
 *
 * This component renders a registration form with fields for username, email, and password.
 * It uses `react-hook-form` for form validation and `react-aria-components` for accessibility.
 *
 * @component
 * @example
 * ```tsx
 * <Register />
 * ```
 */
const Register: React.FC = () => {
  /**
   * Default form values for the registration form.
   */
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  /**
   * Interface for the form data.
   */
  interface FormData {
    /** Username entered by the user */
    username: string;

    /** Email entered by the user */
    email: string;

    /** Password entered by the user */
    password: string;
  }

  /**
   * Handles form submission.
   *
   * @param data - The form data containing username, email, and password.
   */
  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      const response = await authApi.register(
        data.username,
        data.email,
        data.password
      );
      console.log(response);
      alert("Registration successful!");
      reset(); // Reset the form after successful registration
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const { t } = useTranslation();

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Controller
        control={control}
        name="username"
        rules={{
          required: t("pages.register.form.validation.username.required"),
          minLength: {
            value: 3,
            message: t("pages.register.form.validation.username.minLength"),
          },
          maxLength: {
            value: 20,
            message: t("pages.register.form.validation.username.maxLength"),
          },
          pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message: t("pages.register.form.validation.username.pattern"),
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
            label={t("pages.register.form.username")}
            placeholder={t("pages.register.form.placeholder.username")}
            invalid={invalid}
            error={error}
            className={styles.input}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        rules={{
          required: t("pages.register.form.validation.email.required"),
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: t("pages.register.form.validation.email.invalid"),
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
            label={t("pages.register.form.email")}
            placeholder={t("pages.register.form.placeholder.email")}
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
          required: t("pages.register.form.validation.password.required"),
          minLength: {
            value: 8,
            message: t("pages.register.form.validation.password.minLength"),
          },
          maxLength: {
            value: 50,
            message: t("pages.register.form.validation.password.maxLength"),
          },
          pattern: {
            value:
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            message: t("pages.register.form.validation.password.pattern"),
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
            label={t("pages.register.form.password")}
            type="password"
            placeholder={t("pages.register.form.placeholder.password")}
            invalid={invalid}
            error={error}
            className={styles.input}
          />
        )}
      />
      <Button type="submit" className={styles.button}>
        {t("pages.register.form.submit")}
      </Button>
    </Form>
  );
};

export default Register;
