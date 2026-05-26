import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

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
      <div className="bg-[#0b3b24] container mx-auto p-8 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea580c]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0b3b24] container mx-auto p-8 min-h-[400px] flex items-center justify-center">
        <div className="bg-red-900/50 text-red-200 border border-red-700 p-4 rounded-lg text-center max-w-md w-full">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b3b24] text-white min-h-screen py-12 px-4 md:px-8 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-center text-3xl md:text-5xl font-extrabold mb-10 tracking-wide font-serif">
          {t("home.discoverMenu")}
        </h2>

        <div className="mb-10 flex justify-center">
          <input
            type="text"
            placeholder={t("home.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-5 py-3 bg-[#114b30] border border-[#1a5f3e] rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ea580c] text-center transition-all"
          />
        </div>

        <div className="flex flex-wrap justify-center items-center border border-[#1a5f3e] rounded-lg mb-12 overflow-hidden bg-[#0a3520]">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`flex-1 min-w-[100px] py-3 text-sm md:text-base font-medium transition-all text-center border-b md:border-b-0 md:border-r border-[#1a5f3e] last:border-0 ${
              selectedCategory === "All"
                ? "text-[#ea580c] bg-[#114b30] font-bold"
                : "text-gray-300 hover:text-white hover:bg-[#0c4228]"
            }`}
          >
            {t("common.all")}
          </button>

          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`flex-1 min-w-[100px] py-3 text-sm md:text-base font-medium transition-all text-center border-b md:border-b-0 md:border-r border-[#1a5f3e] last:border-0 ${
                selectedCategory === category._id
                  ? "text-[#ea580c] bg-[#114b30] font-bold"
                  : "text-gray-300 hover:text-white hover:bg-[#0c4228]"
              }`}
            >
              {getLocalizedText(category.name)}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-lg border border-dashed border-[#1a5f3e] rounded-xl">
            {t("home.noSearchResults")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
