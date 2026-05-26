import { useState, useEffect } from "react";
import api from "../../api/axios";
import type { Product, ProductInput, Category } from "../../types";

interface ProductModalProps {
  product?: Product;
  categories: Category[];
  loadingCategories: boolean;
  onClose: () => void;
  onSave: (data: ProductInput) => Promise<void>;
}

function ProductModal({ product, categories, loadingCategories, onClose, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState<ProductInput>({
    name: { en: "", ar: "" },
    price: 0,
    category: "",
    image: "",
    available: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

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
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      alert("Please select a category");
      return;
    }
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch {
      alert("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">
          {product ? "Edit Product" : "Add Product"}
        </h2>


        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name (English)
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
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name (Arabic)
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
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
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
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            {loadingCategories ? (
              <div className="w-full p-2 border rounded-lg bg-gray-50 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2" />
                <span className="text-gray-500 text-sm">Loading categories...</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="w-full p-2 border rounded-lg bg-gray-50 text-gray-500 text-sm">
                No categories available
              </div>
            ) : (
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name?.en || cat.name?.ar || "Unnamed Category"}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
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
              className="w-full p-2 border rounded-lg"
            />
            {uploading && (
              <div className="mt-2 text-sm text-gray-500 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2" />
                Uploading...
              </div>
            )}
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Product preview"
                  className="w-24 h-24 object-cover rounded-lg border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="available"
              checked={formData.available}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, available: e.target.checked }))
              }
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="available" className="ml-2 text-sm text-gray-700">
              Available
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !formData.category}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                saving || !formData.category
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {saving ? "Saving..." : product ? "Update" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
