import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import ar from "./ar.json";

type LanguageCode = "en" | "ar";

const savedLanguage =
  (localStorage.getItem("lang") as LanguageCode | null) ?? "en";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: "en",
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

const updateDocumentDirection = (lng: LanguageCode) => {
  const dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
};

updateDocumentDirection(savedLanguage);

i18n.on("languageChanged", (lng) => {
  const language = (lng as LanguageCode) ?? "en";
  localStorage.setItem("lang", language);
  updateDocumentDirection(language);
});

export const setAppLanguage = async (lng: LanguageCode) => {
  if (lng === i18n.language) return i18n;
  return i18n.changeLanguage(lng);
};

export default i18n;
