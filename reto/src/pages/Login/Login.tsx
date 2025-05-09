import React from "react";
import { Form } from "react-aria-components";
import Input from "@components/Input/Input";
import { Controller, useForm } from "react-hook-form";
import Button from "@components/Button/Button";
import axios from "axios"; // Import axios and AxiosError
import styles from "./Login.module.css"; // Import the CSS module

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
    try {
      await axios.post(
        "http://localhost:3000/login",
        data,
        { withCredentials: true } // Include credentials for cookies
      );

      alert("Login successful!");
      reset(); // Reset the form after successful login
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios-specific errors
        if (error.response && error.response.status === 401) {
          alert("Invalid credentials. Please try again.");
        } else if (error.response && error.response.status === 404) {
          alert("User not found.");
        } else {
          console.error("Error during login:", error);
          alert("Login failed. Please try again.");
        }
      } else {
        // Handle non-Axios errors
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
            value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
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
        Login
      </Button>
    </Form>
  );
};

export default Login;
