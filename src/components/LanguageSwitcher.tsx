import { useTranslation } from "react-i18next";
import { setAppLanguage } from "../i18n";
import { Languages } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language as "en" | "ar") || "en";

  const handleChange = (lng: "en" | "ar") => {
    if (lng !== currentLang) {
      setAppLanguage(lng);
    }
  };

  return (
    <div className="flex items-center border border-border-light rounded-xl bg-white/5 p-0.5">
      <button
        type="button"
        onClick={() => handleChange("en")}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
          currentLang === "en"
            ? "bg-brand-orange text-white shadow-sm"
            : "text-text-secondary hover:text-text-primary"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleChange("ar")}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
          currentLang === "ar"
            ? "bg-brand-orange text-white shadow-sm"
            : "text-text-secondary hover:text-text-primary"
        }`}
      >
        AR
      </button>
    </div>
  );
}
