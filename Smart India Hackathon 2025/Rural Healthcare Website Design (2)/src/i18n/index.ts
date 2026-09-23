import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import hi from './locales/hi.json';
import pa from './locales/pa.json';

const resources = {
  en: {
    translation: en
  },
  hi: {
    translation: hi
  },
  pa: {
    translation: pa
  }
};

// Initialize i18n
const initI18n = () => {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      debug: false,
      interpolation: {
        escapeValue: false
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage']
      },
      react: {
        useSuspense: false
      }
    });
};

// Initialize immediately
initI18n();

export default i18n;
