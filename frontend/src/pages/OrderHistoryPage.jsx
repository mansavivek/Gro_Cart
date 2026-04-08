import { useMemo, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Spinner from '../components/ui/Spinner';
import { useOrders } from '../hooks/useOrders';

function getStatusClass(status) {
  const normalizedStatus = String(status || '').toLowerCase();
  const map = {
    placed: 'bg-amber-100 text-amber-700',
    delivered: 'bg-emerald-100 text-primary',
    out_for_delivery: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-blue-100 text-blue-700',
    packed: 'bg-blue-100 text-blue-700',
    pending: 'bg-surface-container-high text-on-surface-variant',
  };
  return map[normalizedStatus] || 'bg-surface-container-high text-on-surface-variant';
}

export default function OrderHistoryPage() {
  const { orders, loading } = useOrders();
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});
  const pageBackgroundStyle = {
    backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuDeX4zOPo9TX3mkIqXejygJX8y9j01whBwv0ZKx080l-wfAJttySxhoIoNkAKEQS7lYt9gZkH3fcWUc-OTSSyc5WSWss1pXtjWpBi22Lkf5_syDMf1g_-Dm3sIoZ-hgsVs3_K32J6NUT11S3_WoqLe3O5ahFXC65EgH2rwf8mZNnqgDHB4lc7G0JKAYMdOw7M_F36tHRTDgGygRlz6ZWhC1gOlaiLstaG3z05Dxt3JlKDWNzagnylvAcIdG16Cp0TnbaR6j-P8UXKE)",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const visibleOrders = useMemo(() => {
    let list = Array.isArray(orders) ? orders : [];

    if (statusFilter !== 'all') {
      list = list.filter((order) => String(order.status || '').toLowerCase() === statusFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((order) => {
        const byId = `${order.id}`.includes(q);
        const byStatus = String(order.status || '').toLowerCase().includes(q);
        const byAddress = (order.delivery_address || '').toLowerCase().includes(q);
        const byItemName = order.items?.some((item) => item.product?.name?.toLowerCase().includes(q));
        return byId || byStatus || byAddress || byItemName;
      });
    }

    if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === 'price_high') {
      list.sort((a, b) => b.total_amount - a.total_amount);
    } else if (sortBy === 'price_low') {
      list.sort((a, b) => a.total_amount - b.total_amount);
    } else {
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return list;
  }, [orders, search, sortBy, statusFilter]);

  return (
    <MainLayout backgroundStyle={pageBackgroundStyle}>
      <main className="pt-2 pb-12 px-2 max-w-5xl mx-auto font-body">
        <section className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <p className="font-headline text-primary font-bold text-sm tracking-widest uppercase">My Activity</p>
              <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">Order History</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select className="appearance-none bg-surface-container-lowest border-none rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium text-on-surface shadow-sm focus:ring-2 focus:ring-primary/20 cursor-pointer" onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
                  <option value="all">All Statuses</option>
                  <option value="placed">Placed</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="packed">Packed</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline-variant">keyboard_arrow_down</span>
              </div>
              <div className="relative">
                <select className="appearance-none bg-surface-container-lowest border-none rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium text-on-surface shadow-sm focus:ring-2 focus:ring-primary/20 cursor-pointer" onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="price_low">Price: Low to High</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline-variant">sort</span>
              </div>
              <input className="bg-surface-container-high rounded-lg px-4 py-2.5 text-sm" onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." value={search} />
            </div>
          </div>
        </section>

        {loading ? (
          <Spinner />
        ) : visibleOrders.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">inventory_2</span>
            <p>No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {visibleOrders.map((order) => (
              <div key={order.id} className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(43,47,49,0.05)] transition-all hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 bg-surface-container-low rounded-lg flex items-center justify-center overflow-hidden">
                        <span className="material-symbols-outlined text-primary">local_grocery_store</span>
                      </div>
                      <div>
                        <h3 className="font-headline font-bold text-lg text-on-surface">Order #{order.id}</h3>
                        <p className="text-sm text-on-surface-variant font-medium">Placed on {new Date(order.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusClass(order.status)}`}>
                        {String(order.status || 'unknown').replace(/_/g, ' ')}
                      </span>
                      <p className="font-headline font-extrabold text-xl text-on-surface">${(order.total_amount ?? order.total_price ?? 0).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-surface-container">
                    <div className="flex gap-3">
                      <span className="material-symbols-outlined text-primary" data-icon="location_on">location_on</span>
                      <div className="text-sm">
                        <p className="font-semibold text-on-surface">Delivery Address</p>
                        <p className="text-on-surface-variant leading-relaxed">{order.delivery_address || 'Address unavailable'}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="material-symbols-outlined text-primary" data-icon="local_shipping">local_shipping</span>
                      <div className="text-sm">
                        <p className="font-semibold text-on-surface">Order Status</p>
                        <p className="text-on-surface-variant leading-relaxed capitalize">{String(order.status || 'unknown').replace(/_/g, ' ')}</p>
                      </div>
                    </div>
                  </div>

                  {order.items?.length > 0 && (
                    <div className="mt-4 rounded-lg bg-surface-container-low p-3">
                      {(expandedOrders[order.id] ? order.items : order.items.slice(0, 3)).map((item) => (
                        <div className="mb-2 flex items-center justify-between text-sm last:mb-0" key={item.id}>
                          <span className="text-on-surface-variant">{item.product?.name} x {item.quantity}</span>
                          <span className="font-semibold text-on-surface">${((item.unit_price || item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      {order.items.length > 3 ? (
                        <button
                          className="mt-2 text-xs font-semibold text-primary hover:text-primary-dim"
                          onClick={() => setExpandedOrders((prev) => ({ ...prev, [order.id]: !prev[order.id] }))}
                          type="button"
                        >
                          {expandedOrders[order.id] ? 'View Less' : 'View All Items'}
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </MainLayout>
  );
}
