export type LocalizedText = {
  en: string;
  ar: string;
};

export const isRTL = (lng?: string) => (lng || "en") === "ar";
