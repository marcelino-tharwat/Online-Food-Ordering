import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { Search, Loader2, AlertCircle, Salad } from "lucide-react";

interface CategoryName {
  en: string;
  ar: string;
}

interface Category {
  _id: string;
  name: CategoryName;
}

interface Product {
  _id: string;
  name: CategoryName;
  price: number;
  image: string;
  category?: string;
}

interface ProductsResponse {
  success: boolean;
  data: Product[];
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

function Menu() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language as "en" | "ar") || "en";
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get<ProductsResponse>("/products"),
          api.get<CategoriesResponse>("/categories"),
        ]);
        setProducts(productsRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
      } catch {
        setError(
          t("home.loadMenuError", "Failed to load menu. Please try again."),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [t]);

  const getLocalizedText = (obj: CategoryName | undefined): string => {
    if (!obj) return "";
    return currentLang === "ar" ? obj.ar : obj.en;
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const productName = getLocalizedText(product.name).toLowerCase();
    const matchesSearch = productName.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
          <p className="text-text-secondary text-sm font-medium animate-pulse-soft">
            {t("common.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-error-bg border border-error-border rounded-2xl p-8 text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <p className="text-error-text text-sm font-medium" role="alert">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-black font-serif tracking-tight mb-3">
            {t("home.discoverMenu")}
          </h2>
          <p className="text-text-secondary text-sm md:text-base max-w-md mx-auto">
            Explore our carefully crafted selection of premium dishes
          </p>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder={t("home.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-10 pe-4 py-3 bg-surface-card border border-border-medium rounded-xl text-text-primary placeholder:text-text-tertiary/60 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/50 transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              selectedCategory === "All"
                ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-orange-900/30"
                : "bg-white/5 text-text-secondary border-border-light hover:text-text-primary hover:bg-white/10 hover:border-border-medium"
            }`}
          >
            {t("common.all")}
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === category._id
                  ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-orange-900/30"
                  : "bg-white/5 text-text-secondary border-border-light hover:text-text-primary hover:bg-white/10 hover:border-border-medium"
              }`}
            >
              {getLocalizedText(category.name)}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Salad className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
            <p className="text-text-secondary text-sm font-medium">
              {t("home.noSearchResults")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={getLocalizedText(product.name)}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
