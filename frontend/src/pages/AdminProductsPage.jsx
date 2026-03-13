import { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
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
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const [p, c] = await Promise.all([getProducts(), getCategories()]);
    setProducts(p.data);
    setCategories(c.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity),
      category_id: form.category_id ? parseInt(form.category_id) : null,
    };
    if (editId) {
      await updateProduct(editId, payload);
    } else {
      await createProduct(payload);
    }
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
    load();
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      quantity: product.quantity,
      image_url: product.image_url || '',
      category_id: product.category_id || '',
    });
    setEditId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
    load();
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <Button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(!showForm); }}>
          {showForm ? 'Cancel' : '+ Add Product'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">{editId ? 'Edit Product' : 'New Product'}</h2>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Price ($)" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <Input label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <Input label="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="sm:col-span-2" />
            <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="sm:col-span-2" />
            <Button type="submit" className="sm:col-span-2">
              {editId ? 'Update Product' : 'Add Product'}
            </Button>
          </form>
        </Card>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-100">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="text-sm">
                  <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.category?.name || '—'}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600">{p.quantity}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(p)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MainLayout>
  );
}
