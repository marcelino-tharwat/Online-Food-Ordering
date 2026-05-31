import { useTranslation } from "react-i18next";
import { setAppLanguage } from "../i18n";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language as "en" | "ar") || "en";

  const handleChange = (lng: "en" | "ar") => {
    if (lng !== currentLang) {
      setAppLanguage(lng);
    }
  };

  return (
    <div className="flex items-center border border-border-light rounded-md bg-accent/50 p-0.5">
      <button
        type="button"
        onClick={() => handleChange("en")}
        className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
          currentLang === "en"
            ? "bg-primary text-white shadow-sm"
            : "text-text-secondary hover:text-primary"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleChange("ar")}
        className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
          currentLang === "ar"
            ? "bg-primary text-white shadow-sm"
            : "text-text-secondary hover:text-primary"
        }`}
      >
        AR
      </button>
    </div>
  );
}
