import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enUS from "./locales/en-US.json";
import fiFI from "./locales/fi-FI.json";
import ruRU from "./locales/ru-RU.json";

export const initI18n = () => {
  i18n.use(initReactI18next).init({
    resources: {
      en: enUS,
      fi: fiFI,
      ru: ruRU,
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });
};
