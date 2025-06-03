import i18next from "i18next";

export const getFormattedDate = (dateRaw: string): string => {
  const date = new Date(dateRaw);
  const currentYear = new Date().getFullYear();
  const year = date.getFullYear();

  return date.toLocaleDateString(i18next.language, {
    day: "2-digit",
    month: "long",
    year: currentYear === year ? undefined : "numeric",
  });
};
