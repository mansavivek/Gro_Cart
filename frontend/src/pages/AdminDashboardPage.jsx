import { useEffect, useMemo, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Spinner from '../components/ui/Spinner';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../services/productService';
import { getAdminOrders, updateOrderStatus } from '../services/orderService';

const STATUS_OPTIONS = ['pending', 'in_progress', 'packed', 'out_for_delivery', 'delivered'];
const emptyForm = { name: '', description: '', price: '', quantity: '', image_url: '', category_id: '' };

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [nutritionRows, setNutritionRows] = useState([
    { name: 'Calories', value: '160 kcal' },
    { name: 'Total Fat', value: '15g' },
  ]);
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [minTotal, setMinTotal] = useState('');
  const [maxTotal, setMaxTotal] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryPage, setInventoryPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const pageBackgroundStyle = {
    backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuDeX4zOPo9TX3mkIqXejygJX8y9j01whBwv0ZKx080l-wfAJttySxhoIoNkAKEQS7lYt9gZkH3fcWUc-OTSSyc5WSWss1pXtjWpBi22Lkf5_syDMf1g_-Dm3sIoZ-hgsVs3_K32J6NUT11S3_WoqLe3O5ahFXC65EgH2rwf8mZNnqgDHB4lc7G0JKAYMdOw7M_F36tHRTDgGygRlz6ZWhC1gOlaiLstaG3z05Dxt3JlKDWNzagnylvAcIdG16Cp0TnbaR6j-P8UXKE)",
  };

  const load = async () => {
    setLoading(true);
    try {
      const [p, o, c] = await Promise.all([getProducts(), getAdminOrders(), getCategories()]);
      setProducts(p.data || []);
      setOrders(o.orders || []);
      setCategories(c.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const revenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const activeOrders = orders.filter((order) => ['pending', 'in_progress', 'packed', 'out_for_delivery'].includes(order.status)).length;
    const lowStock = products.filter((product) => (product.quantity || 0) <= 5).length;
    return { totalOrders, revenue, activeOrders, lowStock };
  }, [orders, products]);

  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (statusFilter !== 'all') {
      list = list.filter((order) => order.status === statusFilter);
    }

    const query = orderSearch.trim().toLowerCase();
    if (query) {
      list = list.filter((order) => {
        const customerName = (order.user?.name || '').toLowerCase();
        return `${order.id}`.includes(query) || customerName.includes(query);
      });
    }

    const min = minTotal === '' ? null : Number(minTotal);
    const max = maxTotal === '' ? null : Number(maxTotal);
    if (min !== null && !Number.isNaN(min)) {
      list = list.filter((order) => Number(order.total_amount || 0) >= min);
    }
    if (max !== null && !Number.isNaN(max)) {
      list = list.filter((order) => Number(order.total_amount || 0) <= max);
    }

    list.sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === 'total_low') return Number(a.total_amount || 0) - Number(b.total_amount || 0);
      if (sortBy === 'total_high') return Number(b.total_amount || 0) - Number(a.total_amount || 0);
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return list;
  }, [orders, statusFilter, orderSearch, minTotal, maxTotal, sortBy]);

  const filteredInventory = useMemo(() => {
    const query = inventorySearch.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      categories.find((c) => c.id === product.category_id)?.name.toLowerCase().includes(query)
    );
  }, [products, inventorySearch, categories]);

  const paginatedInventory = useMemo(() => {
    const startIdx = (inventoryPage - 1) * itemsPerPage;
    return filteredInventory.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredInventory, inventoryPage, itemsPerPage]);

  const totalInventoryPages = Math.ceil(filteredInventory.length / itemsPerPage);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingOrderId(orderId);
    await updateOrderStatus(orderId, { status });
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
    setUpdatingOrderId(null);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    setError('');

    try {
      const payload = {
        ...form,
        price: Number(parseFloat(form.price || 0).toFixed(2)),
        quantity: parseInt(form.quantity || '0', 10),
        category_id: form.category_id ? parseInt(form.category_id, 10) : null,
      };
      if (editingProductId) {
        await updateProduct(editingProductId, payload);
      } else {
        await createProduct(payload);
      }
      const latest = await getProducts();
      setProducts(latest.data || []);
      setForm(emptyForm);
      setEditingProductId(null);
      setToast(' Item added ');
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to add product right now.');
    } finally {
      setSavingProduct(false);
    }
  };

  const resetProductForm = () => {
    setForm(emptyForm);
    setEditingProductId(null);
    setNutritionRows([
      { name: 'Calories', value: '160 kcal' },
      { name: 'Total Fat', value: '15g' },
    ]);
    setError('');
  };

  const updateNutritionRow = (index, field, value) => {
    setNutritionRows((rows) => rows.map((row, idx) => (idx === index ? { ...row, [field]: value } : row)));
  };

  const addNutritionRow = () => setNutritionRows((rows) => [...rows, { name: '', value: '' }]);
  const removeNutritionRow = (index) => setNutritionRows((rows) => rows.filter((_, idx) => idx !== index));

  const startEditProduct = (product) => {
    setActiveTab('products');
    setEditingProductId(product.id);
    setInventoryPage(1);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: `${product.price || ''}`,
      quantity: `${product.quantity || ''}`,
      image_url: product.image_url || '',
      category_id: product.category_id ? `${product.category_id}` : '',
    });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteProduct(id);
      const latest = await getProducts();
      setProducts(latest.data || []);
      setToast(' Product deleted ');
      if (editingProductId === id) {
        resetProductForm();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete product.');
    }
  };

  if (loading) {
    return <MainLayout backgroundStyle={pageBackgroundStyle}><Spinner /></MainLayout>;
  }

  return (
    <MainLayout backgroundStyle={pageBackgroundStyle}>
      <main className="max-w-[1600px] mx-auto w-full p-2 space-y-8">
        <header className="pt-2">
          <h1 className="text-2xl font-extrabold text-[#006a3b] tracking-tight">Analytics Overview</h1>
          <p className="text-sm text-outline font-body">Welcome back!</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)]">
            <p className="text-outline text-xs font-semibold uppercase tracking-widest mb-1">Total Orders</p>
            <h3 className="text-3xl font-black text-on-surface">{metrics.totalOrders}</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)]">
            <p className="text-outline text-xs font-semibold uppercase tracking-widest mb-1">Revenue</p>
            <h3 className="text-3xl font-black text-on-surface">${metrics.revenue.toFixed(2)}</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)]">
            <p className="text-outline text-xs font-semibold uppercase tracking-widest mb-1">Active Orders</p>
            <h3 className="text-3xl font-black text-on-surface">{metrics.activeOrders}</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)]">
            <p className="text-outline text-xs font-semibold uppercase tracking-widest mb-1">Low Stock Products</p>
            <h3 className="text-3xl font-black text-on-surface">{metrics.lowStock}</h3>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)] overflow-hidden">
          <div className="border-b border-surface-container p-4">
            <div className="inline-flex gap-2 rounded-xl bg-surface-container-low p-1">
              <button
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === 'orders' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
                onClick={() => setActiveTab('orders')}
                type="button"
              >
                Manage Orders
              </button>
              <button
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === 'products' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
                onClick={() => setActiveTab('products')}
                type="button"
              >
                Add Product
              </button>
              <button
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === 'inventory' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
                onClick={() => setActiveTab('inventory')}
                type="button"
              >
                Manage Inventory
              </button>
            </div>
          </div>

          {activeTab === 'orders' ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 p-4 border-b border-surface-container bg-surface-container-low/40">
                <input
                  className="lg:col-span-2 rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by order id or customer"
                  type="text"
                  value={orderSearch}
                />
                <select
                  className="rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  value={statusFilter}
                >
                  <option value="all">All statuses</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <input
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                    min="0"
                    onChange={(e) => setMinTotal(e.target.value)}
                    placeholder="Min $"
                    type="number"
                    value={minTotal}
                  />
                  <input
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                    min="0"
                    onChange={(e) => setMaxTotal(e.target.value)}
                    placeholder="Max $"
                    type="number"
                    value={maxTotal}
                  />
                </div>
                <select
                  className="rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                  onChange={(e) => setSortBy(e.target.value)}
                  value={sortBy}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="total_high">Total high-low</option>
                  <option value="total_low">Total low-high</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/50">
                      <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Total</th>
                      <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr className="border-b border-surface-container" key={order.id}>
                        <td className="px-6 py-4 font-semibold text-primary">#{order.id}</td>
                        <td className="px-6 py-4 text-on-surface">{order.user?.name || 'Customer'}</td>
                        <td className="px-6 py-4 text-on-surface-variant">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-on-surface font-semibold">${order.total_amount}</td>
                        <td className="px-6 py-4">
                          <select
                            className="text-xs font-semibold bg-surface border-outline-variant/30 rounded-lg py-1.5 pl-3 pr-8 focus:ring-primary focus:border-primary"
                            disabled={updatingOrderId === order.id}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            value={order.status}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!filteredOrders.length ? (
                  <p className="px-6 py-10 text-center text-sm text-on-surface-variant">No orders match the current filters.</p>
                ) : null}
              </div>
            </div>
          ) : activeTab === 'products' ? (
            <div className="p-6">
              <header className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline">add_box</span>
                  <h2 className="text-xl font-extrabold tracking-tight text-on-surface">{editingProductId ? 'Edit Product Inventory' : 'Add New Product'}</h2>
                </div>
                <div className="flex items-center gap-4">
                  <button className="px-4 py-2 text-sm font-medium text-outline hover:text-on-surface transition-colors" onClick={resetProductForm} type="button">
                    Discard
                  </button>
                  <button className="px-6 py-2 bg-primary text-on-primary rounded-lg font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-60" disabled={savingProduct} onClick={handleAddProduct} type="button">
                    {savingProduct ? 'Saving...' : editingProductId ? 'Update Product' : 'Save Product'}
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <form className="lg:col-span-8 space-y-8 pb-6" onSubmit={handleAddProduct}>
                  {error ? (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
                      <p className="font-semibold">Product save failed</p>
                      <p>{error}</p>
                    </div>
                  ) : null}

                  <section className="bg-surface p-8 rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)] border border-transparent">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">info</span>
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-semibold text-outline uppercase tracking-wider">Product Name</label>
                        <input className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary focus:bg-surface transition-all" onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="e.g. Organic Hass Avocados" required type="text" value={form.name} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-outline uppercase tracking-wider">Category</label>
                        <select className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary focus:bg-surface transition-all" onChange={(e) => setForm((prev) => ({ ...prev, category_id: e.target.value }))} value={form.category_id}>
                          <option value="">Select category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-outline uppercase tracking-wider">Stock Quantity</label>
                        <div className="relative">
                          <input className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary focus:bg-surface transition-all" min="0" onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))} placeholder="0" required type="number" value={form.quantity} />
                          <span className="absolute right-3 top-3 text-xs text-outline">Units</span>
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-semibold text-outline uppercase tracking-wider">Description</label>
                        <textarea className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary focus:bg-surface transition-all" onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Describe the product details..." rows="4" value={form.description} />
                      </div>
                    </div>
                  </section>

                  <section className="bg-surface p-8 rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)]">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">image</span>
                      Media Assets
                    </h3>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-outline uppercase tracking-wider">Image URL</label>
                      <input className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary focus:bg-surface transition-all" onChange={(e) => setForm((prev) => ({ ...prev, image_url: e.target.value }))} placeholder="https://example.com/image.jpg" type="url" value={form.image_url} />
                    </div>
                  </section>

                  <section className="bg-surface p-8 rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)]">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">payments</span>
                      Pricing &amp; Inventory
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-outline uppercase tracking-wider">Base Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-outline">$</span>
                          <input className="w-full bg-surface-container-low border-none rounded-lg p-3 pl-8 focus:ring-2 focus:ring-primary focus:bg-surface transition-all" min="0" onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} placeholder="0.00" required step="0.01" type="number" value={form.price} />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="bg-surface p-8 rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)]">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">nutrition</span>
                        Nutrition Details
                      </h3>
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

                    <div className="bg-surface rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(43,47,49,0.05)] border border-transparent hover:-translate-y-1 transition-all">
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
                            <h4 className="font-headline font-bold text-gray-900">{form.name || 'Product name preview'}</h4>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-outline uppercase">Price</p>
                            <p className="font-black text-primary">${form.price || '0.00'}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{form.description || 'Product description preview appears here.'}</p>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-on-surface">Manage Inventory</h2>
                  <p className="text-sm text-on-surface-variant">Edit and delete product records from your catalog.</p>
                </div>
                <button
                  className="rounded-lg border border-outline-variant/25 px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container"
                  onClick={() => {
                    resetProductForm();
                    setActiveTab('products');
                  }}
                  type="button"
                >
                  Add New Product
                </button>
              </header>

              <div className="mb-4">
                <input
                  className="rounded-lg border border-outline-variant/30 bg-surface px-4 py-2.5 text-sm w-full focus:ring-primary focus:border-primary"
                  onChange={(e) => {
                    setInventorySearch(e.target.value);
                    setInventoryPage(1);
                  }}
                  placeholder="Search product by name, description, or category..."
                  type="text"
                  value={inventorySearch}
                />
              </div>

              <div className="overflow-x-auto rounded-xl border border-outline-variant/15">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/60">
                      <th className="px-5 py-3 text-xs font-bold text-outline uppercase tracking-wider">Product</th>
                      <th className="px-5 py-3 text-xs font-bold text-outline uppercase tracking-wider">Category</th>
                      <th className="px-5 py-3 text-xs font-bold text-outline uppercase tracking-wider">Price</th>
                      <th className="px-5 py-3 text-xs font-bold text-outline uppercase tracking-wider">Stock</th>
                      <th className="px-5 py-3 text-xs font-bold text-outline uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedInventory.map((product) => (
                      <tr className="border-b border-surface-container" key={product.id}>
                        <td className="px-5 py-4 font-semibold text-gray-900">{product.name}</td>
                        <td className="px-5 py-4 text-sm text-gray-600">{categories.find((category) => category.id === product.category_id)?.name || 'Uncategorized'}</td>
                        <td className="px-5 py-4 text-sm text-gray-900">${product.price?.toFixed?.(2) || product.price}</td>
                        <td className="px-5 py-4 text-sm text-gray-900">{product.quantity}</td>
                        <td className="px-5 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              className="rounded-md border border-outline-variant/25 px-3 py-1.5 text-xs font-semibold text-on-surface"
                              onClick={() => startEditProduct(product)}
                              type="button"
                            >
                              Edit
                            </button>
                            <button
                              aria-label="Delete product"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteProduct(product.id)}
                              type="button"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!filteredInventory.length ? (
                  <p className="px-6 py-10 text-center text-sm text-on-surface-variant">
                    {inventorySearch ? 'No products match your search.' : 'No inventory items available.'}
                  </p>
                ) : null}
              </div>

              {filteredInventory.length > 0 ? (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-on-surface-variant">
                    Showing {((inventoryPage - 1) * itemsPerPage) + 1} to {Math.min(inventoryPage * itemsPerPage, filteredInventory.length)} of {filteredInventory.length} products
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-lg border border-outline-variant/30 bg-surface px-3 py-1.5 text-sm font-medium disabled:opacity-50"
                      disabled={inventoryPage === 1}
                      onClick={() => setInventoryPage(Math.max(1, inventoryPage - 1))}
                      type="button"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalInventoryPages }).map((_, idx) => {
                        const page = idx + 1;
                        const isVisible = Math.abs(page - inventoryPage) <= 1 || page === 1 || page === totalInventoryPages;
                        if (!isVisible && idx > 0 && idx < totalInventoryPages - 1) return null;
                        return (
                          <button
                            key={page}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                              page === inventoryPage
                                ? 'bg-primary text-on-primary'
                                : 'border border-outline-variant/30 bg-surface hover:bg-surface-container'
                            }`}
                            onClick={() => setInventoryPage(page)}
                            type="button"
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      className="rounded-lg border border-outline-variant/30 bg-surface px-3 py-1.5 text-sm font-medium disabled:opacity-50"
                      disabled={inventoryPage === totalInventoryPages}
                      onClick={() => setInventoryPage(Math.min(totalInventoryPages, inventoryPage + 1))}
                      type="button"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {toast ? (
          <div className="fixed bottom-6 right-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-xl">
            {toast}
          </div>
        ) : null}
      </main>
    </MainLayout>
  );
}
