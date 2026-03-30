import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Badge, { orderStatusBadge } from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { useOrders } from '../hooks/useOrders';

const PREVIEW_COUNT = 3;

function OrderItemsAccordion({ items }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = items.length > PREVIEW_COUNT;
  const visible = expanded ? items : items.slice(0, PREVIEW_COUNT);

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="space-y-2">
        {visible.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            {/* Static grocery icon */}
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🛒</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                {item.product?.name || 'Product'}
              </p>
              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
            </div>
            <span className="text-sm font-semibold text-gray-700 shrink-0">
              ${((item.unit_price || item.product?.price || 0) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700 transition-colors"
        >
          {expanded ? (
            <>
              <span className="text-sm leading-none">▲</span> View less
            </>
          ) : (
            <>
              <span className="text-sm leading-none">▼</span> View all {items.length} items
            </>
          )}
        </button>
      )}
    </div>
  );
}

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
          <p className="font-medium text-gray-500">No orders yet</p>
          <p className="text-sm mt-1 text-gray-400">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-5">
              {/* Order header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-800">Order #{order.id}</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString(undefined, {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    <span className="text-sm text-gray-500">
                      📍 {order.delivery_address}
                    </span>
                    <span className="text-sm text-gray-500">
                      💳 {order.payment_method}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <Badge color={orderStatusBadge(order.status)}>
                    {order.status.replace(/_/g, ' ')}
                  </Badge>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    ${order.total_amount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Items accordion */}
              {order.items && order.items.length > 0 && (
                <OrderItemsAccordion items={order.items} />
              )}
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
