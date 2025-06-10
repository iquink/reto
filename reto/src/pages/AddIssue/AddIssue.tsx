import React from "react";
import { Form } from "react-aria-components";
import { Input, TextArea, Button, FileTrigger } from "@components/index";
import { AddIssueModal } from "./AddIssueModal/AddIssueModal";
import { Controller, useForm } from "react-hook-form";
import { useStore } from "@store";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import styles from "./AddIssue.module.css";

const AddIssue: React.FC = observer(() => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      coordinates: "",
      files: null,
    },
  });

  const { t } = useTranslation();
  const { issuesStore } = useStore();

  interface FormData {
    title: string;
    description: string;
    coordinates: string;
    files: FileList | null;
  }

  const onSubmit = async (data: FormData): Promise<void> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("coordinates", data.coordinates);
    if (data.files) {
      Array.from(data.files).forEach((file) => {
        formData.append("files", file);
      });
    }
    await issuesStore.addIssue(formData); // Your store/api should handle FormData
    alert("Form submitted successfully!");
    reset();
    issuesStore.clearSelectedLocation();
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
      encType="multipart/form-data"
    >
      <Controller
        control={control}
        name="title"
        rules={{
          required: t("pages.addIssue.form.validation.title.required"),
          minLength: {
            value: 3,
            message: t("pages.addIssue.form.validation.title.minLength"),
          },
          maxLength: {
            value: 100,
            message: t("pages.addIssue.form.validation.title.maxLength"),
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
            label={t("pages.addIssue.form.title")}
            placeholder={t("pages.addIssue.form.placeholder.title")}
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
          required: t("pages.addIssue.form.validation.description.required"),
          minLength: {
            value: 10,
            message: t("pages.addIssue.form.validation.description.minLength"),
          },
          maxLength: {
            value: 500,
            message: t("pages.addIssue.form.validation.description.maxLength"),
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
            label={t("pages.addIssue.form.description")}
            placeholder={t("pages.addIssue.form.placeholder.description")}
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
          required: t("pages.addIssue.form.validation.coordinates.required"),
        }}
        render={({ field: { name, value, ref } }) => (
          <Input type="hidden" name={name} value={value} ref={ref} />
        )}
      />
      <div className={styles.coordinatesRow}>
        <div className={styles.coordinatesInfo}>
          <strong className={styles.coordinatesTitle}>
            {t("pages.addIssue.form.selectedCoordinates")}
          </strong>{" "}
          {Array.isArray(issuesStore.selectedLocation) &&
          issuesStore.selectedLocation.length === 2
            ? `${issuesStore.selectedLocation[0]}, ${issuesStore.selectedLocation[1]}`
            : t("pages.addIssue.form.selectOnMap")}
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
      <Controller
        control={control}
        name="files"
        render={({ field: { onChange, value, ref } }) => (
          <>
            <FileTrigger
              ref={ref}
              onSelect={(e: FileList) => {
                onChange(e);
              }}
              value={value}
              acceptedFileTypes={["image/*"]}
              allowsMultiple={true}
            >
              {t("pages.addIssue.form.uploadFile")}
            </FileTrigger>
            {value &&
              Array.from(value)
                .map((f) => f.name)
                .join(", ")}
          </>
        )}
      />
      <Button type="submit" className={styles.button}>
        {t("pages.addIssue.form.submit")}
      </Button>
    </Form>
  );
});

export default AddIssue;
