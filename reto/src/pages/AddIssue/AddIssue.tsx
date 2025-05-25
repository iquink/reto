import React from "react";
import { Form } from "react-aria-components";
import { Input, TextArea, Button, AddIssueModal } from "@components";
import { Controller, useForm } from "react-hook-form";
import { useStore } from "@store";
import { observer } from "mobx-react-lite";
import styles from "./AddIssue.module.css";

const AddIssue: React.FC = observer(() => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      coordinates: "",
    },
  });

  const { issuesStore, authStore } = useStore();
  const { user } = authStore;

  interface FormData {
    title: string;
    description: string;
    coordinates: string;
  }

  const onSubmit = async (data: FormData): Promise<void> => {
    console.log("Form submitted:", data);
    issuesStore.addIssue({
      user_id: Number(user.id),
      title: data.title,
      description: data.description,
      coordinates: data.coordinates,
    });
    alert("Form submitted successfully!");
    reset();
    issuesStore.clearSelectedLocation();
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
      <Controller
        control={control}
        name="coordinates"
        rules={{
          required: "Coordinates are required.",
        }}
        render={({ field: { name, value, ref } }) => (
          <Input type="hidden" name={name} value={value} ref={ref} />
        )}
      />
      <div className={styles.coordinatesRow}>
        <div className={styles.coordinatesInfo}>
          <strong className={styles.coordinatesTitle}>
            Selected coordinates:
          </strong>{" "}
          {Array.isArray(issuesStore.selectedLocation) &&
          issuesStore.selectedLocation.length === 2
            ? `${issuesStore.selectedLocation[0]}, ${issuesStore.selectedLocation[1]}`
            : "Press the map button to select coordinates"}
          {errors.coordinates && (
            <span className={styles.error}>{errors.coordinates.message}</span>
          )}
        </div>
        <div className={styles.coordinatesModal}>
          <AddIssueModal
            onCoordinatesChanged={() =>
              setValue(
                "coordinates",
                Array.isArray(issuesStore.selectedLocation) &&
                  issuesStore.selectedLocation.length === 2
                  ? `${issuesStore.selectedLocation[0]} ${issuesStore.selectedLocation[1]}`
                  : ""
              )
            }
          />
        </div>
      </div>
      <Button type="submit" className={styles.button}>
        Submit
      </Button>
    </Form>
  );
});

export default AddIssue;
