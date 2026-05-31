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
  Package,
  Search,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";

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
        currentLang === "ar" ? "برجاء اختيار القسم" : "Please select a category",
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-bold text-text-tertiary mb-1.5 uppercase tracking-wide">
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
          className="w-full px-4 py-2.5 bg-white border border-border-medium rounded-lg text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 transition-all text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-text-tertiary mb-1.5 uppercase tracking-wide">
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
          className="w-full px-4 py-2.5 bg-white border border-border-medium rounded-lg text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 transition-all text-sm"
          required
          dir="rtl"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-text-tertiary mb-1.5 uppercase tracking-wide">
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
          className="w-full px-4 py-2.5 bg-white border border-border-medium rounded-lg text-text-primary font-mono font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 transition-all text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-text-tertiary mb-1.5 uppercase tracking-wide">
          {currentLang === "ar" ? "القسم" : "Category"}
        </label>
        {loadingCategories ? (
          <div className="w-full px-4 py-2.5 bg-white border border-border-medium rounded-lg flex items-center text-text-tertiary text-sm gap-2">
            <Loader2 className="animate-spin w-4 h-4 text-primary" />
            <span>{currentLang === "ar" ? "جاري تحميل الأقسام..." : "Loading categories..."}</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="w-full px-4 py-2.5 bg-white border border-border-medium rounded-lg text-text-tertiary text-sm">
            {currentLang === "ar" ? "لا توجد أقسام متاحة" : "No categories available"}
          </div>
        ) : (
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
            className="w-full px-4 py-2.5 bg-white border border-border-medium rounded-lg text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 transition-all text-sm appearance-none"
            required
          >
            <option value="" className="bg-white text-text-tertiary">
              {currentLang === "ar" ? "اختر القسم" : "Select a category"}
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id} className="bg-white text-text-primary">
                {currentLang === "ar"
                  ? cat.name?.ar || cat.name?.en
                  : cat.name?.en || cat.name?.ar}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-text-tertiary mb-1.5 uppercase tracking-wide">
          {currentLang === "ar" ? "صورة المنتج" : "Image"}
        </label>
        <div className="relative flex items-center justify-center w-full min-h-[100px] bg-white border-2 border-dashed border-border-medium rounded-2xl p-4 hover:border-primary/30 hover:bg-primary-lighter transition-all cursor-pointer group">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="text-center space-y-1 text-text-tertiary group-hover:text-text-secondary transition-colors flex flex-col items-center">
            <ImagePlus className="w-6 h-6 mb-1 text-text-tertiary group-hover:text-primary" />
            <span className="text-xs font-medium">
              {currentLang === "ar"
                ? "اضغط لرفع صورة للمنتج"
                : "Click to upload product image"}
            </span>
          </div>
        </div>

        {uploading && (
          <div className="mt-2 text-xs text-text-tertiary flex items-center gap-1.5">
            <Loader2 className="animate-spin w-3.5 h-3.5 text-primary" />
            <span>{currentLang === "ar" ? "جاري الرفع..." : "Uploading..."}</span>
          </div>
        )}

        {formData.image && !uploading && (
          <div className="mt-3 flex justify-center">
            <img
              src={formData.image}
              alt="Product preview"
              className="w-20 h-20 object-cover rounded-xl border border-border-light shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2.5 pt-1">
        <input
          type="checkbox"
          id="available"
          checked={formData.available}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, available: e.target.checked }))
          }
          className="w-4 h-4 rounded border-border-medium bg-white text-primary accent-primary focus:ring-primary/30"
        />
        <label
          htmlFor="available"
          className="text-sm font-bold text-text-secondary select-none cursor-pointer"
        >
          {currentLang === "ar" ? "متاح للطلب" : "Available"}
        </label>
      </div>

      <div className="flex gap-3 pt-5 border-t border-border-light">
        <Button type="button" variant="outline" size="md" onClick={onClose} className="flex-1">
          {currentLang === "ar" ? "إلغاء" : "Cancel"}
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={saving || !formData.category}
          loading={saving}
          className="flex-1"
        >
          {saving
            ? currentLang === "ar" ? "جاري الحفظ..." : "Saving..."
            : product
              ? currentLang === "ar" ? "تحديث" : "Update"
              : currentLang === "ar" ? "إضافة" : "Add Product"}
        </Button>
      </div>
    </form>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
      alert(currentLang === "ar" ? "فشل حذف المنتج" : "Failed to delete product");
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
      alert(currentLang === "ar" ? "فشل تحديث حالة المنتج" : "Failed to update product");
    }
  };

  const filteredProducts = products.filter((p) =>
    (p.name?.en || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.name?.ar || "").includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-text-primary">
              {currentLang === "ar" ? "قائمة المنتجات" : "Products Management"}
            </h1>
            <p className="text-xs text-text-tertiary mt-0.5">
              {currentLang === "ar"
                ? "إضافة وتعديل وحذف أصناف قائمة الطعام"
                : "Manage and control your digital restaurant menu items"}
            </p>
          </div>
        </div>
        <Button
          onClick={handleAdd}
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
        >
          <span>{currentLang === "ar" ? "إضافة منتج" : "Add Product"}</span>
        </Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
        <input
          type="text"
          placeholder={currentLang === "ar" ? "بحث..." : "Search products..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full ps-9 pe-3 py-2 bg-white border border-border-medium rounded-lg text-text-primary text-sm placeholder:text-text-tertiary/60 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 border border-border-light rounded-2xl bg-white">
          <Package className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
          <p className="text-text-secondary text-sm font-medium">
            {currentLang === "ar" ? "لم يتم العثور على أي منتجات" : "No products found"}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-light text-sm">
              <thead className="bg-accent/40">
                <tr>
                  {["Image", "Name", "Price", "Status", "Actions"].map(
                    (_, i) => (
                      <th
                        key={i}
                        className={`px-5 py-3.5 text-xs font-bold text-text-tertiary uppercase tracking-wider ${
                          i === 4 ? "text-end" : "text-start"
                        }`}
                      >
                        {i === 0
                          ? currentLang === "ar" ? "الصورة" : "Image"
                          : i === 1
                            ? currentLang === "ar" ? "الاسم" : "Name"
                            : i === 2
                              ? currentLang === "ar" ? "السعر" : "Price"
                              : i === 3
                                ? currentLang === "ar" ? "الحالة" : "Status"
                                : currentLang === "ar" ? "الخيارات" : "Actions"}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-accent/20 transition-colors"
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="w-11 h-11 bg-accent/50 border border-border-light rounded-xl overflow-hidden flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name?.en || "Product"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <ImagePlus className="w-4 h-4 text-text-tertiary" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-semibold text-text-primary">{product.name?.en || "N/A"}</div>
                      <div className="text-xs text-text-tertiary mt-0.5" dir="rtl">
                        {product.name?.ar || ""}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-mono font-bold text-text-primary">
                      ${product.price?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggle(product)}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all border ${
                          product.available
                            ? "bg-success-bg text-success border-success/20 hover:bg-success/15"
                            : "bg-error-bg text-error border-error/20 hover:bg-error/15"
                        }`}
                      >
                        {product.available
                          ? currentLang === "ar" ? "متاح" : "Available"
                          : currentLang === "ar" ? "غير متاح" : "Unavailable"}
                      </button>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-end">
                      <div className="flex items-center gap-3 justify-end">
                        <button
                          onClick={() => handleEdit(product._id)}
                          className="text-info hover:text-info/80 transition-colors flex items-center gap-1.5 font-bold text-xs"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{currentLang === "ar" ? "تعديل" : "Edit"}</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product._id)}
                          className="text-error hover:text-error/80 transition-colors flex items-center gap-1.5 font-bold text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{currentLang === "ar" ? "حذف" : "Delete"}</span>
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editingProduct
            ? currentLang === "ar" ? "تعديل المنتج" : "Edit Product"
            : currentLang === "ar" ? "إضافة منتج جديد" : "Add Product"
        }
        maxWidth="max-w-lg"
      >
        {modalLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : (
          <ProductModal
            product={editingProduct}
            categories={categories}
            loadingCategories={loadingCategories}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        variant="confirmation"
        maxWidth="max-w-sm"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-error-bg border border-error-border text-error rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold mb-2 tracking-wide text-text-primary">
            {currentLang === "ar" ? "تأكيد الحذف" : "Confirm Delete"}
          </h3>
          <p className="text-xs text-text-secondary mb-6 leading-relaxed">
            {currentLang === "ar"
              ? "هل أنت متأكد من رغبتك في حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء لاحقًا."
              : "Are you sure you want to delete this product? This action cannot be undone."}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" size="md" onClick={() => setDeleteConfirm(null)} className="flex-1">
              {currentLang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => handleDelete(deleteConfirm!)}
              className="flex-1 !bg-error hover:!bg-error/90"
            >
              {currentLang === "ar" ? "حذف نهائي" : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AdminProducts;
