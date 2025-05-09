import React from "react";
import { Form } from "react-aria-components";
import Input from "@components/Input/Input";
import { Controller, useForm } from "react-hook-form";
import Button from "@components/Button/Button";
import styles from "./Register.module.css"; // Import the CSS module
import { authApi } from "@api/index"; // Import the authApi for registration

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
      name: "",
      email: "",
      password: "",
    },
  });

  /**
   * Interface for the form data.
   */
  interface FormData {
    /** Username entered by the user */
    name: string;

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
        data.name,
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

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Controller
        control={control}
        name="name"
        rules={{
          required: "Username is required.",
          minLength: {
            value: 3,
            message: "Username must be at least 3 characters long.",
          },
          maxLength: {
            value: 20,
            message: "Username cannot exceed 20 characters.",
          },
          pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message:
              "Username can only contain letters, numbers, and underscores.",
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
            label="Username"
            placeholder="Enter your username"
            invalid={invalid}
            error={error}
            className={styles.input} // Apply the input style
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email is required.",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email address.",
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
            label="Email"
            placeholder="Enter your email"
            invalid={invalid}
            error={error}
            className={styles.input} // Apply the input style
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        rules={{
          required: "Password is required.",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters long.",
          },
          maxLength: {
            value: 50,
            message: "Password cannot exceed 50 characters.",
          },
          pattern: {
            value:
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            message:
              "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
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
            label="Password"
            type="password"
            placeholder="Enter your password"
            invalid={invalid}
            error={error}
            className={styles.input} // Apply the input style
          />
        )}
      />
      <Button type="submit" className={styles.button}>
        Register
      </Button>
    </Form>
  );
};

export default Register;
