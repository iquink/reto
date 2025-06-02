import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fi from "./locales/fi.json";
import ru from "./locales/ru.json";
import LanguageDetector from 'i18next-browser-languagedetector';


i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    supportedLngs: ["en-US", "fi-FI", "ru-RU"],
    resources: {
      "en": en,
      "fi": fi,
      "ru": ru,
    },
    fallbackLng: "fi-FI",
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    detection: {
      order: ["localStorage", "navigator", "querystring", "htmlTag"],
      caches: ["localStorage"]
    },
    nonExplicitSupportedLngs: true,
  });

export default i18n;