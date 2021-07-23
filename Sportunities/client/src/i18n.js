import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import translationFR from "./locales/fr/translations.json";

i18n
  .use(initReactI18next)
  .use(Backend)
  .use(LanguageDetector)
  .init({
    debug: false,
    lng: "fr",
    fallbackLng: "fr",
    resources: {
      fr: {
        translations: translationFR,
      },
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: ",",
    },
    ns: ["translations"],
    defaultNS: "translations",
    react: {
      bindI18n: "languageChanged loaded",
    },
    nsSeparator: "\\",
  })
  .catch((e) => console.log(e))
;

export default i18n;
