import { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Badge, { orderStatusBadge } from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { getAllOrders, updateOrderStatus } from '../services/orderService';

const STATUS_OPTIONS = ['pending', 'in_progress', 'packed', 'out_for_delivery', 'delivered'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAllOrders()
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (orderId, status) => {
    await updateOrderStatus(orderId, { status });
    load();
  };

  return (
    <MainLayout>
      <main className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">Order Status Management</h1>
            <p className="text-on-surface-variant max-w-2xl">Manage and track customer deliveries. Update fulfillment stages in real-time.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-surface-container-lowest text-on-surface px-4 py-2 rounded-lg shadow-sm border border-outline-variant/20 hover:bg-surface-container transition-colors" type="button">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              <span className="text-sm font-semibold">Filter Orders</span>
            </button>
          </div>
        </header>

        {loading ? (
          <Spinner />
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📦</p>
            <p>No orders yet.</p>
          </div>
        ) : (
          <>
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.05)] overflow-hidden border border-outline-variant/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant uppercase text-[11px] font-bold tracking-widest">
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Current Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {orders.map((order) => (
                      <tr className="hover:bg-surface-container-low/50 transition-colors group" key={order.id}>
                        <td className="px-6 py-5 font-mono text-sm text-primary font-bold">#{order.id}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container text-xs font-bold">
                              {(order.user?.name || 'GC').split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium">{order.user?.name || 'Customer'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-on-surface-variant">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-5 text-sm font-bold">${order.total_amount}</td>
                        <td className="px-6 py-5">
                          <Badge color={orderStatusBadge(order.status)}>{order.status.replace(/_/g, ' ')}</Badge>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <select
                            className="text-xs font-semibold bg-surface border-outline-variant/30 rounded-lg py-1.5 pl-3 pr-8 focus:ring-primary focus:border-primary transition-all cursor-pointer"
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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-surface-container-low rounded-xl border-l-4 border-primary">
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Active Deliveries</div>
                <div className="text-2xl font-black text-on-surface">{orders.filter((o) => o.status === 'out_for_delivery').length}</div>
              </div>
              <div className="p-4 bg-surface-container-low rounded-xl border-l-4 border-amber-500">
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">To Be Packed</div>
                <div className="text-2xl font-black text-on-surface">{orders.filter((o) => o.status === 'packed').length}</div>
              </div>
              <div className="p-4 bg-surface-container-low rounded-xl border-l-4 border-error">
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Pending Review</div>
                <div className="text-2xl font-black text-on-surface">{orders.filter((o) => o.status === 'pending').length}</div>
              </div>
              <div className="p-4 bg-surface-container-low rounded-xl border-l-4 border-blue-500">
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Delivered</div>
                <div className="text-2xl font-black text-on-surface">{orders.filter((o) => o.status === 'delivered').length}</div>
              </div>
            </div>
          </>
        )}
      </main>
    </MainLayout>
  );
}
