import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ru from "./locales/ru.json";
import fi from "./locales/fi.json";
import en from "./locales/en.json";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    supportedLngs: ["en", "fi", "ru"],
    resources: {
      en: { translation: en },
      fi: { translation: fi },
      ru: { translation: ru },
    },
    fallbackLng: "fi",
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    detection: {
      order: ["localStorage", "navigator", "querystring", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;
