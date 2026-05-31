import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import api from "../api/axios";
import { Heart, Loader2, ShoppingBag } from "lucide-react";
import ProductCard from "../components/ProductCard";

interface Product {
  _id: string;
  name: { en: string; ar: string };
  price: number;
  image: string;
}

function Favorites() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const favoriteIds = useSelector((state: RootState) => state.favorites.favoriteIds);
  const currentLang = (i18n.language as "en" | "ar") || "en";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/products");
        const all = res.data?.data || res.data?.products || [];
        setProducts(all.filter((p: Product) => favoriteIds.includes(p._id)));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    if (favoriteIds.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
      setProducts([]);
    }
  }, [favoriteIds]);

  const getLocalizedText = (obj: { en: string; ar: string }) =>
    currentLang === "ar" ? obj.ar : obj.en;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-error-bg border border-error-border flex items-center justify-center">
            <Heart className="w-8 h-8 text-error" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-text-primary">
            {t("favorites.emptyTitle")}
          </h2>
          <p className="text-text-secondary text-sm mb-8">
            {t("favorites.emptyMessage")}
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="px-8 py-3.5 bg-primary text-white rounded-md font-semibold shadow-sm hover:bg-primary-hover transition-all"
          >
            {t("favorites.browseMenu")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 px-4 md:px-8 bg-surface-mint min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary mb-8">
          {t("favorites.myFavorites")}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={getLocalizedText(product.name)}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Favorites;
