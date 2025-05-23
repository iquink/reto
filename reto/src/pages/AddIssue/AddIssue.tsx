import React from "react";
import { Form } from "react-aria-components";
import { Input } from "@components";
import { TextArea } from "@components";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@components";
import styles from "./AddIssue.module.css"; // Import the CSS module
import { AddIssueModal } from "@components";
import { useStore } from "@store"; // <-- Add this import
import { observer } from "mobx-react-lite";

/**
 * AddIssue component for creating a new issue.
 *
 * This component renders a form with a text input for the issue title,
 * a textarea for the issue description, and a submit button.
 * It uses `react-hook-form` for form validation and `react-aria-components` for accessibility.
 *
 * @component
 * @example
 * ```tsx
 * <AddIssue />
 * ```
 */
const AddIssue: React.FC = observer(() => {
  /**
   * Default form values for the Add Issue form.
   */
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { issuesStore } = useStore(); // <-- Get the store

  /**
   * Interface for the form data.
   */
  interface FormData {
    /** Title of the issue */
    title: string;

    /** Description of the issue */
    description: string;
  }

  /**
   * Handles form submission.
   *
   * @param data - The form data containing title and description.
   */
  const onSubmit = async (data: FormData): Promise<void> => {
    // Submit logic will go here when the endpoint is available
    console.log("Form submitted:", data);
    alert("Form submitted successfully!");
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Controller
        control={control}
        name="title"
        rules={{
          required: "Title is required.",
          minLength: {
            value: 3,
            message: "Title must be at least 3 characters long.",
          },
          maxLength: {
            value: 100,
            message: "Title cannot exceed 100 characters.",
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
            label="Title"
            placeholder="Enter the issue title"
            invalid={invalid}
            error={error}
            className={styles.input}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        rules={{
          required: "Description is required.",
          minLength: {
            value: 10,
            message: "Description must be at least 10 characters long.",
          },
          maxLength: {
            value: 500,
            message: "Description cannot exceed 500 characters.",
          },
        }}
        render={({
          field: { name, value, onChange, onBlur, ref },
          fieldState: { invalid, error },
        }) => (
          <TextArea
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            ref={ref}
            label="Description"
            placeholder="Enter the issue description"
            invalid={invalid}
            error={error}
            className={styles.textarea}
          />
        )}
      />
      {/* Coordinates display section */}
      <div className={styles.coordinatesRow}>
        <div className={styles.coordinatesInfo}>
          <strong className={styles.coordinatesTitle}>
            Selected coordinates:
          </strong>{" "}
          {Array.isArray(issuesStore.selectedLocation) &&
            issuesStore.selectedLocation.length !== 0 &&
            `${issuesStore.selectedLocation[0]}, ${issuesStore.selectedLocation[1]}`}
        </div>
        <div className={styles.coordinatesModal}>
          <AddIssueModal />
        </div>
      </div>
      <Button type="submit" className={styles.button}>
        Submit
      </Button>
    </Form>
  );
});

export default AddIssue;
