export const getFormattedDate = (dateRaw: string): string => {
  const date = new Date(dateRaw);
  const currentYear = new Date().getFullYear();
  const year = date.getFullYear();

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: currentYear === year ? undefined : "numeric",
  });
};
