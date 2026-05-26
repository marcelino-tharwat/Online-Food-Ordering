import { useState, useEffect } from 'react';
import api from '../../api/axios';
import type { Product, ProductInput, Category } from '../../types';

interface ProductModalProps {
  product?: Product;
  categories: Category[];
  loadingCategories: boolean;
  onClose: () => void;
  onSave: (data: ProductInput) => Promise<void>;
}

export function ProductModal({ product, categories, loadingCategories, onClose, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState<ProductInput>({
    name: { en: '', ar: '' },
    price: 0,
    category: '',
    image: '',
    available: true,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars\n  const [_imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      const categoryValue =
        typeof product.category === 'object' && product.category !== null
          ? (product.category as { _id: string })._id
          : product.category || '';

      setFormData({
        name: product.name || { en: '', ar: '' },
        price: product.price || 0,
        category: categoryValue,
        image: product.image || '',
        available: product.available ?? true,
      });
    }
  }, [product]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const response = await api.post('/admin/upload-image', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = response.data?.imageUrl || response.data?.image || '';
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    } catch {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch {
      alert('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg w-full max-w-md p-6'>
        <h2 className='text-xl font-bold mb-4'>
          {product ? 'Edit Product' : 'Add Product'}
        </h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Name (English)
            </label>
            <input
              type='text'
              value={formData.name.en}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: { ...prev.name, en: e.target.value },
                }))
              }
              className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Name (Arabic)
            </label>
            <input
              type='text'
              value={formData.name.ar}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: { ...prev.name, ar: e.target.value },
                }))
              }
              className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              required
              dir='rtl'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Price
            </label>
            <input
              type='number'
              step='0.01'
              min='0'
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: parseFloat(e.target.value) || 0,
                }))
              }
              className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Category
            </label>
            {loadingCategories ? (
              <div className='w-full p-2 border rounded-lg bg-gray-50 flex items-center'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2' />
                <span className='text-gray-500 text-sm'>Loading categories...</span>
              </div>
            ) : categories.length === 0 ? (
              <div className='w-full p-2 border rounded-lg bg-gray-50 text-gray-500 text-sm'>
                No categories available
              </div>
            ) : (
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                required
              >
                <option value=''>Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name?.en || cat.name?.ar || 'Unnamed Category'}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Image
            </label>
            <input
              type='file'
              accept='image/*'
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUpload(file);
                }
              }}
              className='w-full p-2 border rounded-lg'
            />
            {uploading && (
              <div className='mt-2 text-sm text-gray-500 flex items-center'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2' />
                Uploading...
              </div>
            )}
            {formData.image && (
              <div className='mt-2'>
                <img
                  src={formData.image}
                  alt='Product preview'
                  className='w-24 h-24 object-cover rounded-lg border'
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              id='available'
              checked={formData.available}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, available: e.target.checked }))
              }
              className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
            />
            <label htmlFor='available' className='ml-2 text-sm text-gray-700'>
              Available
            </label>
          </div>

          <div className='flex gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={saving || !formData.category}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                saving || !formData.category
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {saving ? 'Saving...' : product ? 'Update' : 'Add Product'}
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
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await api.get('/categories');
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
      const response = await api.get('/products');
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
      await api.post('/products', data);
    }
    await fetchProducts();
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      setDeleteConfirm(null);
      await fetchProducts();
    } catch {
      alert('Failed to delete product');
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
      alert('Failed to update product');
    }
  };

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Products</h1>
        <button
          onClick={handleAdd}
          className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
        >
          Add Product
        </button>
      </div>

      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600' />
        </div>
      ) : products.length === 0 ? (
        <div className='text-center py-12 text-gray-500'>No products found</div>
      ) : (
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Image
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Name
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Price
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {products.map((product) => (
                <tr key={product._id} className='hover:bg-gray-50'>
                  <td className='px-4 py-3'>
                    <div className='w-12 h-12 relative bg-gray-100 rounded-lg overflow-hidden'>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name?.en || 'Product'}
                          className='w-full h-full object-cover'
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      {!product.image && (
                        <svg
                          className='w-8 h-8 text-gray-300 hidden'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={1.5}
                            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                          />
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='text-sm font-medium text-gray-900'>
                      {product.name?.en || 'N/A'}
                    </div>
                    <div className='text-sm text-gray-500' dir='rtl'>
                      {product.name?.ar || 'N/A'}
                    </div>
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                    ${product.price?.toFixed(2) || '0.00'}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <button
                      onClick={() => handleToggle(product)}
                      className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                        product.available
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {product.available ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-right text-sm'>
                    <button
                      onClick={() => handleEdit(product._id)}
                      className='text-indigo-600 hover:text-indigo-900 mr-4'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product._id)}
                      className='text-red-600 hover:text-red-900'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen &&
        (modalLoading ? (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg w-full max-w-md p-6 flex items-center justify-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600' />
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

      {deleteConfirm && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg w-full max-w-sm p-6'>
            <h3 className='text-lg font-bold mb-2'>Confirm Delete</h3>
            <p className='text-gray-600 mb-4'>
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className='flex gap-3'>
              <button
                onClick={() => setDeleteConfirm(null)}
                className='flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className='flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
