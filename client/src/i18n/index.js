import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ko from "./locales/ko.json";
import en from "./locales/en.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: ko },
      en: { translation: en },
    },
    fallbackLng: "ko",
    supportedLngs: ["ko", "en"],
    nonExplicitSupportedLngs: true, // en-US → en
    interpolation: { escapeValue: false }, // React가 XSS 이스케이프를 담당
    detection: {
      // /ko/·/en/ 리다이렉트가 붙여주는 ?lng=xx 우선, 그다음 저장값·브라우저
      order: ["querystring", "localStorage", "navigator", "htmlTag"],
      lookupQuerystring: "lng",
      lookupLocalStorage: "timetrack-lang",
      caches: ["localStorage"],
    },
  });

// <html lang> 을 현재 언어와 동기화 (접근성·SEO)
const syncHtmlLang = (lng) => {
  document.documentElement.setAttribute("lang", lng);
};
syncHtmlLang(i18n.resolvedLanguage || "ko");
i18n.on("languageChanged", syncHtmlLang);

export default i18n;
