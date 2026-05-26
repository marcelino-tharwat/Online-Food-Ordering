import { useState, useEffect } from "react";
import api from "../../api/axios";
import type { Product, ProductInput, Category } from "../../types";
import { Loader2, X, Upload, CheckCircle, AlertCircle } from "lucide-react";

interface ProductModalProps {
  product?: Product;
  categories: Category[];
  loadingCategories: boolean;
  onClose: () => void;
  onSave: (data: ProductInput) => Promise<void>;
}

function ProductModal({
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
  const [, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const currentLang = localStorage.getItem("lang") || "en";

  // Sync form data when product prop changes (after fetch completes)
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
      alert(
        currentLang === "ar" ? "فشل في رفع الصورة" : "Failed to upload image",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      alert(
        currentLang === "ar"
          ? "برجاء اختيار القسم أولاً"
          : "Please select a category",
      );
      return;
    }
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch {
      alert(
        currentLang === "ar" ? "فشل في حفظ المنتج" : "Failed to save product",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans text-white animate-fade-in">
      <div className="bg-[#0b3b24] border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto style-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${currentLang === "ar" ? "left-4" : "right-4"} text-gray-400 hover:text-white transition-colors`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <h2
          className={`text-xl font-black font-serif tracking-wide mb-6 ${currentLang === "ar" ? "text-right" : "text-left"}`}
        >
          {product
            ? currentLang === "ar"
              ? "تعديل المنتج"
              : "Edit Product"
            : currentLang === "ar"
              ? "إضافة منتج جديد"
              : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name English */}
          <div className="space-y-1.5">
            <label
              className={`block text-xs font-bold text-gray-400 uppercase tracking-wider ${currentLang === "ar" ? "text-right" : "text-left"}`}
            >
              {currentLang === "ar" ? "الاسم (بالإنجليزية)" : "Name (English)"}
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
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#ea580c] transition-colors font-medium"
              required
            />
          </div>

          {/* Name Arabic */}
          <div className="space-y-1.5">
            <label
              className={`block text-xs font-bold text-gray-400 uppercase tracking-wider ${currentLang === "ar" ? "text-right" : "text-left"}`}
            >
              {currentLang === "ar" ? "الاسم (بالعربية)" : "Name (Arabic)"}
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
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#ea580c] transition-colors font-medium text-right"
              required
              dir="rtl"
            />
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <label
              className={`block text-xs font-bold text-gray-400 uppercase tracking-wider ${currentLang === "ar" ? "text-right" : "text-left"}`}
            >
              {currentLang === "ar" ? "السعر" : "Price"}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#ea580c] transition-colors font-mono font-bold"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label
              className={`block text-xs font-bold text-gray-400 uppercase tracking-wider ${currentLang === "ar" ? "text-right" : "text-left"}`}
            >
              {currentLang === "ar" ? "القسم" : "Category"}
            </label>
            {loadingCategories ? (
              <div className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl flex items-center text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 text-[#ea580c] animate-spin mr-2 ml-2" />
                <span>
                  {currentLang === "ar"
                    ? "جاري تحميل الأقسام..."
                    : "Loading categories..."}
                </span>
              </div>
            ) : categories.length === 0 ? (
              <div className="w-full px-4 py-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center text-xs font-medium">
                <AlertCircle className="w-4 h-4 mr-1.5 ml-1.5 shrink-0" />
                <span>
                  {currentLang === "ar"
                    ? "لا توجد أقسام متاحة حالياً"
                    : "No categories available"}
                </span>
              </div>
            ) : (
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#ea580c] transition-colors font-medium text-gray-200 cursor-pointer appearance-none"
                required
              >
                <option value="" className="bg-[#0b3b24] text-gray-400">
                  {currentLang === "ar"
                    ? "اختر قسم المنتج"
                    : "Select a category"}
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                    className="bg-[#0b3b24] text-white"
                  >
                    {currentLang === "ar"
                      ? cat.name?.ar || cat.name?.en
                      : cat.name?.en || cat.name?.ar || "Unnamed Category"}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Image Upload Box */}
          <div className="space-y-1.5">
            <label
              className={`block text-xs font-bold text-gray-400 uppercase tracking-wider ${currentLang === "ar" ? "text-right" : "text-left"}`}
            >
              {currentLang === "ar" ? "صورة المنتج" : "Product Image"}
            </label>

            <label className="flex flex-col items-center justify-center w-full h-28 border border-dashed border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group relative overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    handleImageUpload(file);
                  }
                }}
                className="hidden"
              />

              {uploading ? (
                <div className="flex flex-col items-center gap-2 text-gray-400 text-xs">
                  <Loader2 className="w-5 h-5 text-[#ea580c] animate-spin" />
                  <span>
                    {currentLang === "ar" ? "جاري الرفع..." : "Uploading..."}
                  </span>
                </div>
              ) : formData.image ? (
                <div className="w-full h-full flex items-center justify-between px-4">
                  <img
                    src={formData.image}
                    alt="Product preview"
                    className="w-20 h-20 object-cover rounded-lg border border-white/10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {currentLang === "ar" ? "تم الرفع بنجاح" : "Uploaded"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-gray-400 group-hover:text-white transition-colors text-center p-2">
                  <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#ea580c] transition-colors" />
                  <span className="text-xs font-bold">
                    {currentLang === "ar"
                      ? "اضغط لرفع صورة"
                      : "Click to upload product image"}
                  </span>
                </div>
              )}
            </label>
          </div>

          {/* Availability Toggle */}
          <div
            className={`flex items-center gap-2 pt-1 ${currentLang === "ar" ? "flex-row-reverse" : "flex-row"}`}
          >
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
              className="w-4 h-4 text-[#ea580c] bg-white/5 border-white/20 rounded focus:ring-0 focus:ring-offset-0 focus:outline-none checked:bg-[#ea580c] cursor-pointer"
            />
            <label
              htmlFor="available"
              className="text-xs font-bold text-gray-300 select-none cursor-pointer"
            >
              {currentLang === "ar"
                ? "المنتج متوفر حالياً بالمخزن"
                : "Product is available for ordering"}
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs rounded-xl transition-all border border-white/10"
            >
              {currentLang === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={saving || !formData.category}
              className={`flex-1 px-4 py-2.5 text-white font-bold text-xs rounded-xl transition-all ${
                saving || !formData.category
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed border border-white/5"
                  : "bg-[#ea580c] hover:bg-[#ea580c]/90 border border-[#ea580c]"
              }`}
            >
              {saving
                ? currentLang === "ar"
                  ? "جاري الحفظ..."
                  : "Saving..."
                : product
                  ? currentLang === "ar"
                    ? "تحديث المنتج"
                    : "Update Product"
                  : currentLang === "ar"
                    ? "إضافة المنتج"
                    : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
