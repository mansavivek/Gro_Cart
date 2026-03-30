import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Spinner from '../components/ui/Spinner';
import { getProducts } from '../services/productService';
import { getAllOrders } from '../services/orderService';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    Promise.all([getProducts(), getAllOrders()])
      .then(([p, o]) => {
        setProducts(p.data || []);
        setOrders(o.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const revenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const activeOrders = orders.filter((order) => ['pending', 'in_progress', 'packed', 'out_for_delivery'].includes(order.status)).length;
    const lowStock = products.filter((product) => product.quantity <= 10).length;
    return { totalOrders, revenue, activeOrders, lowStock };
  }, [orders, products]);

  if (loading) {
    return <MainLayout><Spinner /></MainLayout>;
  }

  return (
    <MainLayout>
      <main className="p-2 space-y-8 max-w-[1600px] mx-auto w-full">
        <header className="h-20 flex items-center justify-between px-4 md:px-2 bg-surface/80 backdrop-blur-md sticky top-0 z-40">
          <div>
            <h1 className="text-2xl font-extrabold text-[#006a3b] tracking-tight">Analytics Overview</h1>
            <p className="text-sm text-outline font-body">Welcome back, here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-primary-dim transition-all active:scale-95 shadow-lg shadow-primary/10" to="/admin/products">
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Add Product</span>
            </Link>
            <Link className="bg-secondary-container text-on-secondary-container px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-secondary-fixed transition-all active:scale-95" to="/admin/orders">
              <span className="material-symbols-outlined text-sm">list_alt</span>
              <span>Manage Orders</span>
            </Link>
          </div>
        </header>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)] border border-transparent hover:border-primary/10">
            <p className="text-outline text-xs font-semibold uppercase tracking-widest mb-1">Total Orders</p>
            <h3 className="text-3xl font-black text-on-surface">{metrics.totalOrders}</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)] border border-transparent hover:border-primary/10">
            <p className="text-outline text-xs font-semibold uppercase tracking-widest mb-1">Revenue</p>
            <h3 className="text-3xl font-black text-on-surface">${metrics.revenue.toFixed(2)}</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)] border border-transparent hover:border-primary/10">
            <p className="text-outline text-xs font-semibold uppercase tracking-widest mb-1">Active Orders</p>
            <h3 className="text-3xl font-black text-on-surface">{metrics.activeOrders}</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)] border border-error/5 border-transparent">
            <p className="text-outline text-xs font-semibold uppercase tracking-widest mb-1">Low Stock Products</p>
            <h3 className="text-3xl font-black text-on-surface">{metrics.lowStock}</h3>
          </div>
        </div> */}

        <div className="bg-surface-container-lowest rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)] overflow-hidden">
          <div className="p-8 flex items-center justify-between border-b border-surface-container-low">
            <h3 className="text-lg font-bold text-on-surface">Recent Orders</h3>
            <Link className="text-primary text-sm font-bold hover:underline" to="/admin/orders">View All Orders</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-8 py-4 text-xs font-bold text-outline uppercase tracking-wider">Order ID</th>
                  <th className="px-8 py-4 text-xs font-bold text-outline uppercase tracking-wider">Date</th>
                  <th className="px-8 py-4 text-xs font-bold text-outline uppercase tracking-wider">Total</th>
                  <th className="px-8 py-4 text-xs font-bold text-outline uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 8).map((order) => (
                  <tr className="border-b border-surface-container" key={order.id}>
                    <td className="px-8 py-4 font-semibold text-primary">#{order.id}</td>
                    <td className="px-8 py-4 text-on-surface-variant">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-8 py-4 font-semibold text-on-surface">${order.total_amount}</td>
                    <td className="px-8 py-4">
                      <span className="text-xs font-semibold capitalize bg-surface-container-high px-2 py-1 rounded-full">{order.status.replace(/_/g, ' ')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
