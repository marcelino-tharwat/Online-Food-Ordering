import { useTranslation } from "react-i18next";
import { setAppLanguage } from "../i18n";

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language as "en" | "ar") || "en";

  const handleChange = (lng: "en" | "ar") => {
    if (lng !== currentLang) {
      setAppLanguage(lng);
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm text-white">
      <span className="font-semibold opacity-80">{t("common.language")}</span>
      <button
        type="button"
        onClick={() => handleChange("en")}
        className={`px-3 py-1 rounded-full transition-all border ${
          currentLang === "en"
            ? "bg-white text-[#0b3b24] border-white"
            : "bg-white/10 text-white border-white/20 hover:bg-white/20"
        }`}
      >
        {t("languageSwitcher.english")}
      </button>
      <button
        type="button"
        onClick={() => handleChange("ar")}
        className={`px-3 py-1 rounded-full transition-all border ${
          currentLang === "ar"
            ? "bg-white text-[#0b3b24] border-white"
            : "bg-white/10 text-white border-white/20 hover:bg-white/20"
        }`}
      >
        {t("languageSwitcher.arabic")}
      </button>
    </div>
  );
}
