import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Badge, { orderStatusBadge } from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { useOrders } from '../hooks/useOrders';

export default function OrderHistoryPage() {
  const { orders, loading } = useOrders();

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Order History</h1>

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
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-800">Order #{order.id}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">📍 {order.delivery_address}</p>
                  <p className="text-sm text-gray-500">💳 {order.payment_method}</p>
                </div>
                <div className="text-right">
                  <Badge color={orderStatusBadge(order.status)}>
                    {order.status.replace(/_/g, ' ')}
                  </Badge>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    ${order.total_amount.toFixed(2)}
                  </p>
                </div>
              </div>
              {order.items.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item) => (
                      <span key={item.id} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {item.product?.name} × {item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
