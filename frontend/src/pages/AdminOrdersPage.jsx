import { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Orders</h1>

      {loading ? (
        <Spinner />
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📦</p>
          <p>No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-800">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">📍 {order.delivery_address}</p>
                  <p className="text-sm text-gray-500">💳 {order.payment_method}</p>
                  <p className="text-green-600 font-bold mt-1">${order.total_amount.toFixed(2)}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {order.items.map((item) => (
                      <span key={item.id} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        {item.product?.name} × {item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <Badge color={orderStatusBadge(order.status)}>
                    {order.status.replace(/_/g, ' ')}
                  </Badge>
                  <select
                    className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
