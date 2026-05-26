import i18n from "i18next";

type LanguageCode = "en" | "ar";

export type LocalizedText = {
  en: string;
  ar: string;
};

export const getCurrentLanguage = (): LanguageCode =>
  (i18n.language as LanguageCode) || "en";

export const setAppLanguage = async (lng: LanguageCode) => {
  if (lng === getCurrentLanguage()) return i18n;
  return i18n.changeLanguage(lng);
};

export const getLocalizedText = (
  value?: LocalizedText | string | null,
): string => {
  if (!value) return "";
  if (typeof value === "string") return value;

  return getCurrentLanguage() === "ar" ? value.ar : value.en;
};

export const isRTL = (lng?: string) => (lng || getCurrentLanguage()) === "ar";
