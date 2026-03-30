import { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Spinner from '../components/ui/Spinner';
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService';

const emptyForm = { name: '', description: '', price: '', quantity: '', image_url: '', category_id: '' };

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [nutritionRows, setNutritionRows] = useState([
    { name: 'Calories', value: '160 kcal' },
    { name: 'Total Fat', value: '15g' },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [discount, setDiscount] = useState('0');

  const load = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([getProducts(), getCategories()]);
      setProducts(p.data);
      setCategories(c.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setDiscount('0');
    setEditId(null);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const basePrice = parseFloat(form.price || 0);
      const discountPercent = parseFloat(discount || 0);
      const finalPrice = basePrice - (basePrice * discountPercent) / 100;
      const payload = {
        ...form,
        price: Number(finalPrice.toFixed(2)),
        quantity: parseInt(form.quantity, 10),
        category_id: form.category_id ? parseInt(form.category_id, 10) : null,
      };

      if (editId) {
        await updateProduct(editId, payload);
      } else {
        await createProduct(payload);
      }

      resetForm();
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not save product right now.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: `${product.price}`,
      quantity: `${product.quantity}`,
      image_url: product.image_url || '',
      category_id: product.category_id ? `${product.category_id}` : '',
    });
    setEditId(product.id);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
    await load();
  };

  const updateNutritionRow = (index, field, value) => {
    setNutritionRows((rows) => rows.map((row, idx) => (idx === index ? { ...row, [field]: value } : row)));
  };

  const addNutritionRow = () => setNutritionRows((rows) => [...rows, { name: '', value: '' }]);
  const removeNutritionRow = (index) => setNutritionRows((rows) => rows.filter((_, idx) => idx !== index));

  if (loading) {
    return <MainLayout><Spinner /></MainLayout>;
  }

  return (
    <MainLayout>
      <main className="flex-1 bg-surface min-h-screen overflow-y-auto">
        <header className="h-16 flex items-center justify-between px-8 bg-surface/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-outline">arrow_back</span>
            <h1 className="text-xl font-extrabold tracking-tight text-on-surface">{editId ? 'Edit Product' : 'Add New Product'}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm font-medium text-outline hover:text-on-surface transition-colors" onClick={resetForm} type="button">
              Discard
            </button>
            <button className="px-6 py-2 bg-primary text-on-primary rounded-lg font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-60" disabled={saving} onClick={handleSave} type="button">
              {saving ? 'Saving...' : editId ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form className="lg:col-span-8 space-y-8 pb-24" onSubmit={handleSave}>
            {error ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
                <p className="font-semibold">Product save failed</p>
                <p>{error}</p>
              </div>
            ) : null}

            <section className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)] border border-transparent">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-semibold text-outline uppercase tracking-wider">Product Name</label>
                  <input className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Organic Hass Avocados" required type="text" value={form.name} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-outline uppercase tracking-wider">Category</label>
                  <select className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" onChange={(e) => setForm({ ...form, category_id: e.target.value })} value={form.category_id}>
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-outline uppercase tracking-wider">Stock Quantity</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" min="0" onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="0" required type="number" value={form.quantity} />
                    <span className="absolute right-3 top-3 text-xs text-outline">Units</span>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-semibold text-outline uppercase tracking-wider">Description</label>
                  <textarea className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the origin, flavor profile, and quality of the product..." rows="4" value={form.description} />
                </div>
              </div>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)]">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">image</span>
                Media Assets
              </h2>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-outline uppercase tracking-wider">Image URL</label>
                <input className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://example.com/image.jpg" type="url" value={form.image_url} />
              </div>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)]">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">payments</span>
                Pricing &amp; Inventory
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-outline uppercase tracking-wider">Base Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-outline">$</span>
                    <input className="w-full bg-surface-container-low border-none rounded-lg p-3 pl-8 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" min="0" onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" required step="0.01" type="number" value={form.price} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-outline uppercase tracking-wider">Discount Percentage</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" max="100" min="0" onChange={(e) => setDiscount(e.target.value)} placeholder="0" type="number" value={discount} />
                    <span className="absolute right-3 top-3 text-outline">%</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">nutrition</span>
                  Nutrition Details
                </h2>
                <button className="flex items-center gap-1 text-xs font-bold text-primary hover:bg-primary-container/20 px-3 py-1 rounded-full transition-colors" onClick={addNutritionRow} type="button">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Row
                </button>
              </div>
              <div className="space-y-3">
                {nutritionRows.map((row, idx) => (
                  <div className="grid grid-cols-12 gap-3 items-center" key={`${row.name}-${idx}`}>
                    <div className="col-span-6">
                      <input className="w-full text-xs font-medium bg-surface-container-low border-none rounded-lg p-2" onChange={(e) => updateNutritionRow(idx, 'name', e.target.value)} placeholder="Nutrient name" type="text" value={row.name} />
                    </div>
                    <div className="col-span-4">
                      <input className="w-full text-xs bg-surface-container-low border-none rounded-lg p-2" onChange={(e) => updateNutritionRow(idx, 'value', e.target.value)} placeholder="Value" type="text" value={row.value} />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <button className="text-outline-variant hover:text-error transition-colors" onClick={() => removeNutritionRow(idx)} type="button">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </form>

          <aside className="lg:col-span-4 sticky top-24 h-fit space-y-6">
            <div className="bg-surface-container-high/50 p-6 rounded-2xl border border-surface-container-highest">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-outline">Product Card Preview</h3>
                <span className="material-symbols-outlined text-outline text-sm">visibility</span>
              </div>

              <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(43,47,49,0.05)] border border-transparent hover:-translate-y-1 transition-all">
                <div className="aspect-[4/3] bg-surface-container-low relative">
                  {form.image_url ? (
                    <img alt="Product preview" className="w-full h-full object-cover" src={form.image_url} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-outline">No image selected</div>
                  )}
                  <div className="absolute top-3 left-3 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
                    Organic
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{categories.find((category) => `${category.id}` === form.category_id)?.name || 'Category'}</p>
                      <h4 className="font-headline font-bold text-on-surface">{form.name || 'Product name preview'}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-outline uppercase">Price</p>
                      <p className="font-black text-primary">${form.price || '0.00'}</p>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-2">{form.description || 'Product description preview appears here.'}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)] overflow-hidden border border-outline-variant/10">
              <div className="p-5 border-b border-surface-container-low flex items-center justify-between">
                <h3 className="text-sm font-bold text-on-surface">Existing Products</h3>
              </div>
              <div className="max-h-[480px] overflow-y-auto">
                {products.map((product) => (
                  <div className="p-4 border-b border-surface-container-low last:border-0" key={product.id}>
                    <p className="font-semibold text-sm">{product.name}</p>
                    <p className="text-xs text-on-surface-variant">${product.price.toFixed(2)} · Stock {product.quantity}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="text-xs px-2 py-1 rounded bg-surface-container-high hover:bg-surface-container text-on-surface" onClick={() => handleEdit(product)} type="button">Edit</button>
                      <button className="text-xs px-2 py-1 rounded bg-error-container/20 hover:bg-error-container/40 text-error" onClick={() => handleDelete(product.id)} type="button">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </MainLayout>
  );
}
