import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

function HeroBanner() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = (i18n.language as "en" | "ar") || "en";
  const Arrow = currentLang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-hover to-[#0f3d2f] rounded-3xl mx-4 md:mx-8 mt-6 md:mt-8">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent rounded-full blur-3xl" />
      </div>
      <div className="absolute end-0 bottom-0 w-1/2 h-full flex items-end justify-end overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80"
          alt=""
          className="w-full h-full object-cover opacity-30 md:opacity-40 lg:opacity-60 scale-110 origin-bottom-end"
        />
      </div>
      <div className="relative px-6 md:px-12 py-10 md:py-16">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-accent/80 text-sm font-semibold tracking-wide uppercase">
              "FreshBox"
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            {t("home.heroTitle")}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-lg mb-8 leading-relaxed">
            {t("home.heroSubtitle")}
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-primary rounded-md font-bold shadow-lg hover:bg-accent transition-all text-sm"
          >
            {t("home.heroCta")}
            <Arrow className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
