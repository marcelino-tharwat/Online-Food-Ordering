import { useState, useEffect } from "react";
import api from "../../api/axios";
import type { Product, ProductInput, Category } from "../../types";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  ImagePlus,
  AlertTriangle,
  X,
} from "lucide-react";

interface ProductModalProps {
  product?: Product;
  categories: Category[];
  loadingCategories: boolean;
  onClose: () => void;
  onSave: (data: ProductInput) => Promise<void>;
}

export function ProductModal({
  product,
  categories,
  loadingCategories,
  onClose,
  onSave,
}: ProductModalProps) {
  const [formData, setFormData] = useState<ProductInput>({
    name: { en: "", ar: "" },
    price: 0,
    category: "",
    image: "",
    available: true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const currentLang = localStorage.getItem("lang") || "en";

  useEffect(() => {
    if (product) {
      const categoryValue =
        typeof product.category === "object" && product.category !== null
          ? (product.category as { _id: string })._id
          : product.category || "";

      setFormData({
        name: product.name || { en: "", ar: "" },
        price: product.price || 0,
        category: categoryValue,
        image: product.image || "",
        available: product.available ?? true,
      });
    }
  }, [product]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    try {
      const response = await api.post("/admin/upload-image", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = response.data?.imageUrl || response.data?.image || "";
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    } catch {
      alert(currentLang === "ar" ? "فشل رفع الصورة" : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      alert(
        currentLang === "ar"
          ? "برجاء اختيار القسم"
          : "Please select a category",
      );
      return;
    }
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch {
      alert(currentLang === "ar" ? "فشل حفظ المنتج" : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#0b3b24] border border-white/10 rounded-2xl w-full max-w-md p-6 text-white max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif font-black tracking-wide">
            {product
              ? currentLang === "ar"
                ? "تعديل المنتج"
                : "Edit Product"
              : currentLang === "ar"
                ? "إضافة منتج جديد"
                : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 border border-white/10 rounded-full hover:bg-white/5"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name English */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">
              {currentLang === "ar" ? "الاسم (بالإنجليزي)" : "Name (English)"}
            </label>
            <input
              type="text"
              value={formData.name.en}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: { ...prev.name, en: e.target.value },
                }))
              }
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#ea580c] transition-colors"
              required
            />
          </div>

          {/* Name Arabic */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">
              {currentLang === "ar" ? "الاسم (بالعربي)" : "Name (Arabic)"}
            </label>
            <input
              type="text"
              value={formData.name.ar}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: { ...prev.name, ar: e.target.value },
                }))
              }
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#ea580c] transition-colors"
              required
              dir="rtl"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">
              {currentLang === "ar" ? "السعر" : "Price"}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#ea580c] transition-colors"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">
              {currentLang === "ar" ? "القسم" : "Category"}
            </label>
            {loadingCategories ? (
              <div className="w-full p-3 bg-white/5 border border-white/10 rounded-xl flex items-center text-gray-400 text-sm">
                <Loader2 className="animate-spin w-4 h-4 mr-2 text-[#ea580c]" />
                <span>
                  {currentLang === "ar"
                    ? "جاري تحميل الأقسام..."
                    : "Loading categories..."}
                </span>
              </div>
            ) : categories.length === 0 ? (
              <div className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-sm">
                {currentLang === "ar"
                  ? "لا توجد أقسام متاحة"
                  : "No categories available"}
              </div>
            ) : (
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#ea580c] transition-colors appearance-none"
                required
              >
                <option value="" className="bg-[#0b3b24] text-gray-400">
                  {currentLang === "ar" ? "اختر القسم" : "Select a category"}
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                    className="bg-[#0b3b24] text-white"
                  >
                    {currentLang === "ar"
                      ? cat.name?.ar || cat.name?.en
                      : cat.name?.en || cat.name?.ar}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">
              {currentLang === "ar" ? "صورة المنتج" : "Image"}
            </label>
            <div className="relative flex items-center justify-center w-full min-h-[100px] bg-white/5 border border-dashed border-white/20 rounded-xl p-4 hover:bg-white/10 transition-colors group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="text-center space-y-1 text-gray-400 group-hover:text-white transition-colors flex flex-col items-center">
                <ImagePlus className="w-5 h-5 mb-1 text-gray-400 group-hover:text-[#ea580c]" />
                <span className="text-xs font-medium">
                  {currentLang === "ar"
                    ? "اضغط لرفع صورة للمنتج"
                    : "Click to upload product image"}
                </span>
              </div>
            </div>

            {uploading && (
              <div className="mt-2 text-xs text-gray-400 flex items-center gap-1.5">
                <Loader2 className="animate-spin w-3.5 h-3.5 text-[#ea580c]" />
                <span>
                  {currentLang === "ar" ? "جاري الرفع..." : "Uploading..."}
                </span>
              </div>
            )}

            {formData.image && !uploading && (
              <div className="mt-3 flex justify-center">
                <img
                  src={formData.image}
                  alt="Product preview"
                  className="w-24 h-24 object-cover rounded-xl border border-white/10 shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2.5 pt-2">
            <input
              type="checkbox"
              id="available"
              checked={formData.available}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  available: e.target.checked,
                }))
              }
              className="w-4 h-4 bg-white/5 border border-white/10 rounded focus:ring-0 text-[#ea580c] accent-[#ea580c]"
            />
            <label
              htmlFor="available"
              className="text-sm font-bold text-gray-300 select-none cursor-pointer"
            >
              {currentLang === "ar" ? "متاح للطلب" : "Available"}
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-white/10 text-gray-300 font-bold rounded-xl text-sm hover:bg-white/5 transition-all"
            >
              {currentLang === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={saving || !formData.category}
              className={`flex-1 px-4 py-3 text-white font-bold rounded-xl text-sm transition-all ${
                saving || !formData.category
                  ? "bg-white/10 text-gray-500 cursor-not-allowed"
                  : "bg-[#ea580c] hover:bg-[#f97316]"
              }`}
            >
              {saving
                ? currentLang === "ar"
                  ? "جاري الحفظ..."
                  : "Saving..."
                : product
                  ? currentLang === "ar"
                    ? "تحديث"
                    : "Update"
                  : currentLang === "ar"
                    ? "إضافة"
                    : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(
    undefined,
  );
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const currentLang = localStorage.getItem("lang") || "en";

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await api.get("/categories");
      const cats = response.data?.data || response.data || [];
      setCategories(Array.isArray(cats) ? cats : []);
    } catch {
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/products");
      setProducts(response.data?.data || response.data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setEditingProduct(undefined);
    setModalOpen(true);
  };

  const handleEdit = async (id: string) => {
    setModalLoading(true);
    setModalOpen(true);
    try {
      const response = await api.get(`/products/${id}`);
      setEditingProduct(response.data?.data || response.data || undefined);
    } catch {
      setEditingProduct(undefined);
      setModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSave = async (data: ProductInput) => {
    if (editingProduct?._id) {
      await api.put(`/products/${editingProduct._id}`, data);
    } else {
      await api.post("/products", data);
    }
    await fetchProducts();
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      setDeleteConfirm(null);
      await fetchProducts();
    } catch {
      alert(
        currentLang === "ar" ? "فشل حذف المنتج" : "Failed to delete product",
      );
    }
  };

  const handleToggle = async (product: Product) => {
    try {
      await api.put(`/products/${product._id}`, {
        ...product,
        available: !product.available,
      });
      await fetchProducts();
    } catch {
      alert(
        currentLang === "ar"
          ? "فشل تحديث حالة المنتج"
          : "Failed to update product",
      );
    }
  };

  return (
    <div className="space-y-8 font-sans text-white">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black font-serif tracking-wide">
            {currentLang === "ar" ? "قائمة المنتجات" : "Products Management"}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {currentLang === "ar"
              ? "إضافة وتعديل وحذف أصناف قائمة الطعام"
              : "Manage and control your digital restaurant menu items"}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#ea580c] hover:bg-[#f97316] text-white font-bold text-sm rounded-xl transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{currentLang === "ar" ? "إضافة منتج" : "Add Product"}</span>
        </button>
      </div>

      {/* States view */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 text-[#ea580c] animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 border border-white/10 rounded-2xl bg-white/5 text-gray-400 text-sm">
          {currentLang === "ar"
            ? "لم يتم العثور على أي منتجات"
            : "No products found"}
        </div>
      ) : (
        <div className="border border-white/10 rounded-2xl bg-[#0b3b24] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5 text-sm">
              <thead className="bg-white/5 text-gray-400 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th
                    className={`px-6 py-4 ${currentLang === "ar" ? "text-right" : "text-left"}`}
                  >
                    {currentLang === "ar" ? "الصورة" : "Image"}
                  </th>
                  <th
                    className={`px-6 py-4 ${currentLang === "ar" ? "text-right" : "text-left"}`}
                  >
                    {currentLang === "ar" ? "الاسم" : "Name"}
                  </th>
                  <th
                    className={`px-6 py-4 ${currentLang === "ar" ? "text-right" : "text-left"}`}
                  >
                    {currentLang === "ar" ? "السعر" : "Price"}
                  </th>
                  <th
                    className={`px-6 py-4 ${currentLang === "ar" ? "text-right" : "text-left"}`}
                  >
                    {currentLang === "ar" ? "الحالة" : "Status"}
                  </th>
                  <th
                    className={`px-6 py-4 ${currentLang === "ar" ? "text-left" : "text-right"}`}
                  >
                    {currentLang === "ar" ? "الخيارات" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center relative">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name?.en || "Product"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <ImagePlus className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                      <div>{product.name?.en || "N/A"}</div>
                      <div className="text-xs text-gray-400 mt-0.5" dir="rtl">
                        {product.name?.ar || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-gray-200">
                      ${product.price?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggle(product)}
                        className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                          product.available
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {product.available
                          ? currentLang === "ar"
                            ? "متاح"
                            : "Available"
                          : currentLang === "ar"
                            ? "غير متاح"
                            : "Unavailable"}
                      </button>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${currentLang === "ar" ? "text-left" : "text-right"}`}
                    >
                      <div className="flex items-center gap-4 justify-end">
                        <button
                          onClick={() => handleEdit(product._id)}
                          className="text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1.5 font-bold text-xs"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>{currentLang === "ar" ? "تعديل" : "Edit"}</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product._id)}
                          className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 font-bold text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{currentLang === "ar" ? "حذف" : "Delete"}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Loading Wrapper */}
      {modalOpen &&
        (modalLoading ? (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#0b3b24] border border-white/10 rounded-2xl w-full max-w-md p-12 flex items-center justify-center shadow-lg">
              <Loader2 className="animate-spin h-8 w-8 text-[#ea580c]" />
            </div>
          </div>
        ) : (
          <ProductModal
            product={editingProduct}
            categories={categories}
            loadingCategories={loadingCategories}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
          />
        ))}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#0b3b24] border border-white/10 rounded-2xl w-full max-w-sm p-6 text-white text-center shadow-lg">
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-black mb-2 tracking-wide">
              {currentLang === "ar" ? "تأكيد الحذف" : "Confirm Delete"}
            </h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              {currentLang === "ar"
                ? "هل أنت متأكد من رغبتك في حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء لاحقًا."
                : "Are you sure you want to delete this product? This action cannot be undone."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 border border-white/10 text-gray-300 font-bold rounded-xl text-sm hover:bg-white/5 transition-all"
              >
                {currentLang === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-rose-600 text-white font-bold rounded-xl text-sm hover:bg-rose-700 transition-all shadow-sm"
              >
                {currentLang === "ar" ? "حذف نهائي" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
