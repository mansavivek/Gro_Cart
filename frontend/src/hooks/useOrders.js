import { useState, useEffect } from 'react';
import { getOrderHistory } from '../services/orderService';
import { isMockModeEnabled, subscribeToMockOrderUpdates } from '../services/mockData';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = (showLoading = false) => {
      if (showLoading) setLoading(true);
      getOrderHistory()
        .then(({ data }) => {
          const normalizedOrders = Array.isArray(data) ? data : (Array.isArray(data?.orders) ? data.orders : []);
          setOrders(normalizedOrders);
          setError(null);
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    };

    fetchOrders(true);

    if (!isMockModeEnabled()) return undefined;
    return subscribeToMockOrderUpdates(() => fetchOrders(false));
  }, []);

  return { orders, loading, error };
}
