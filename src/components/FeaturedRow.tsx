import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";

interface FeaturedProduct {
  _id: string;
  name: { en: string; ar: string };
  price: number;
  image: string;
}

interface FeaturedRowProps {
  products: FeaturedProduct[];
  loading?: boolean;
}

function FeaturedRow({ products, loading }: FeaturedRowProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = (i18n.language as "en" | "ar") || "en";

  if (loading) {
    return (
      <div className="py-6 md:py-8">
        <div className="flex items-center justify-between mb-5 px-4 md:px-8">
          <div className="h-6 w-40 bg-accent/50 rounded-md animate-pulse" />
          <div className="h-4 w-20 bg-accent/50 rounded-md animate-pulse" />
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 md:px-8 pb-2 scrollbar-none">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-56">
              <div className="bg-white border border-border-light rounded-2xl overflow-hidden">
                <div className="w-full h-36 bg-accent/50 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-3/4 bg-accent/50 rounded animate-pulse" />
                  <div className="h-4 w-1/3 bg-accent/50 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  const getLocalizedText = (obj: { en: string; ar: string }) =>
    currentLang === "ar" ? obj.ar : obj.en;

  return (
    <div className="py-6 md:py-8">
      <div className="flex items-center justify-between mb-5 px-4 md:px-8">
        <div>
          <h2 className="text-lg md:text-xl font-extrabold text-text-primary">
            {t("home.featuredTitle")}
          </h2>
          <p className="text-xs text-text-tertiary mt-0.5">
            {t("home.featuredSubtitle")}
          </p>
        </div>
        <button
          onClick={() => navigate("/menu")}
          className="text-xs font-bold text-primary hover:text-primary-hover transition-colors"
        >
          {currentLang === "ar" ? "عرض الكل" : "View All"}
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto px-4 md:px-8 pb-2 scrollbar-none snap-x snap-mandatory">
        {products.slice(0, 8).map((product) => (
          <div key={product._id} className="flex-shrink-0 w-48 md:w-56 snap-start">
            <ProductCard
              id={product._id}
              name={getLocalizedText(product.name)}
              price={product.price}
              image={product.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedRow;
