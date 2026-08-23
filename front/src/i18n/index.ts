import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import uk from "./locales/uk.json";
import en from "./locales/en.json";
import sv from "./locales/sv.json";

const savedLanguage =
  localStorage.getItem("waygo_language") ?? "uk";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      uk: {
        translation: uk,
      },

      en: {
        translation: en,
      },

      sv: {
        translation: sv,
      },
    },

    lng: savedLanguage,

    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;