// import { useState, useEffect } from "react";
// import api from "../api/axios";
// import ProductCard from "../components/ProductCard";

// interface CategoryName {
//   en: string;
//   ar: string;
// }

// interface Category {
//   _id: string;
//   name: CategoryName;
// }

// interface Product {
//   _id: string;
//   name: CategoryName;
//   price: number;
//   image: string;
//   category?: string;
// }

// interface ProductsResponse {
//   success: boolean;
//   data: Product[];
// }

// interface CategoriesResponse {
//   success: boolean;
//   data: Category[];
// }

// function Menu() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");

//   const currentLang = localStorage.getItem("lang") || "en";

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       setError("");
//       try {
//         const [productsRes, categoriesRes] = await Promise.all([
//           api.get<ProductsResponse>("/products"),
//           api.get<CategoriesResponse>("/categories"),
//         ]);
//         setProducts(productsRes.data.data || []);
//         setCategories(categoriesRes.data.data || []);
//       } catch (err) {
//         setError("Failed to load menu. Please try again.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const getLocalizedText = (obj: CategoryName | undefined): string => {
//     if (!obj) return "";
//     return currentLang === "ar" ? obj.ar : obj.en;
//   };

//   const filteredProducts = products.filter((product) => {
//     const matchesCategory =
//       selectedCategory === "All" || product.category === selectedCategory;

//     const productName = getLocalizedText(product.name).toLowerCase();
//     const matchesSearch = productName.includes(searchQuery.toLowerCase());

//     return matchesCategory && matchesSearch;
//   });

//   if (isLoading) {
//     return (
//       <div className="container mx-auto p-8 flex justify-center items-center min-h-[400px]">
//         <div className="text-blue-600 text-lg">Loading...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto p-8">
//         <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4 md:p-8">
//       <h1 className="text-3xl font-bold mb-8 text-gray-800">
//         {currentLang === "ar" ? "قائمة الطعام" : "Our Menu"}
//       </h1>

//       {/* Category Tabs */}
//       <div className="flex flex-wrap gap-2 mb-8">
//         <button
//           onClick={() => setSelectedCategory("All")}
//           className={`px-4 py-2 rounded-full font-medium transition-colors ${
//             selectedCategory === "All"
//               ? "bg-blue-600 text-white"
//               : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//           }`}
//         >
//           {currentLang === "ar" ? "الكل" : "All"}
//         </button>
//         {categories.map((category) => (
//           <button
//             key={category._id}
//             onClick={() => setSelectedCategory(category._id)}
//             className={`px-4 py-2 rounded-full font-medium transition-colors ${
//               selectedCategory === category._id
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//             }`}
//           >
//             {getLocalizedText(category.name)}
//           </button>
//         ))}
//       </div>

//       {/* Search Input */}
//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder={
//             currentLang === "ar" ? "ابحث عن منتج..." : "Search for a product..."
//           }
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* Products Grid */}
//       {filteredProducts.length === 0 ? (
//         <div className="text-center py-12 text-gray-500">
//           {currentLang === "ar"
//             ? "لا توجد منتجات متاحة"
//             : "No products available"}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredProducts.map((product) => (
//             <ProductCard
//               key={product._id}
//               id={product._id}
//               name={getLocalizedText(product.name)}
//               price={product.price}
//               image={product.image}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Menu;
import { useState, useEffect } from "react";
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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const currentLang = localStorage.getItem("lang") || "en";

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
      } catch (err) {
        setError("Failed to load menu. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    const fetchDataExecution = fetchData;
    fetchDataExecution();
  }, []);

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
        {/* Spinner متناسق مع اللون البرتقالي للثيم الجديد */}
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
    // الخلفية الخضراء الداكنة للمنيو بالكامل زي الصورة
    <div className="bg-[#0b3b24] text-white min-h-screen py-12 px-4 md:px-8 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        {/* عنوان المنيو - خط عريض مائل قليلاً أو Serif يدي إحساس الـ Branding */}
        <h2 className="text-center text-3xl md:text-5xl font-extrabold mb-10 tracking-wide font-serif">
          {currentLang === "ar" ? "اكتشف قائمتنا" : "Discover Our Menu"}
        </h2>

        {/* شريط البحث المطور ليتماشى مع الخلفية الغامقة */}
        <div className="mb-10 flex justify-center">
          <input
            type="text"
            placeholder={
              currentLang === "ar"
                ? "ابحث عن وجبتك المفضلة..."
                : "Search for your favorite meal..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-5 py-3 bg-[#114b30] border border-[#1a5f3e] rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ea580c] text-center transition-all"
          />
        </div>

        {/* الـ Tabs المقسمة بخطوط رفيعة (Border-separated tabs) زي ديزاين الصورة بالظبط */}
        <div className="flex flex-wrap justify-center items-center border border-[#1a5f3e] rounded-lg mb-12 overflow-hidden bg-[#0a3520]">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`flex-1 min-w-[100px] py-3 text-sm md:text-base font-medium transition-all text-center border-b md:border-b-0 md:border-r border-[#1a5f3e] last:border-0 ${
              selectedCategory === "All"
                ? "text-[#ea580c] bg-[#114b30] font-bold"
                : "text-gray-300 hover:text-white hover:bg-[#0c4228]"
            }`}
          >
            {currentLang === "ar" ? "الكل" : "All"}
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

        {/* شبكة المنتجات (Products Grid) */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-lg border border-dashed border-[#1a5f3e] rounded-xl">
            {currentLang === "ar"
              ? "لم نجد أي وجبات تطابق بحثك"
              : "No meals available matching your search"}
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
