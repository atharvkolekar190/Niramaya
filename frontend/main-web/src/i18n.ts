import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./locales/en/translation.json";
import translationHI from "./locales/hi/translation.json";
import translationMR from "./locales/mr/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      hi: { translation: translationHI },
      mr: { translation: translationMR },
    },
    lng: "en",            // default language
    fallbackLng: "en",    // fallback if translation not found
    interpolation: {
      escapeValue: false, // react already escapes
    },
  });

export default i18n;
