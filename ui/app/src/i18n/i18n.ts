import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend'
import { i18nextPlugin } from 'translation-check'
i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .use(i18nextPlugin)
  .init<HttpBackendOptions>({
    lng: "en",
    fallbackLng: "en",  
    supportedLngs: ["en", "fr", "am"],
    ns: ["dashboard"],
    defaultNS: "dashboard",
    saveMissing: true,
    backend: {
      loadPath: "../locales/{{lng}}.{{ns}}.json",
      addPath: "../locales/add/{{lng}}.missing.{{ns}}.json",
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: true,
    },
  });

export default i18n;
