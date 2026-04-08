import { useState, useEffect } from 'react';
import { getOrderHistory } from '../services/orderService';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOrderHistory()
      .then(({ data }) => {
        const normalizedOrders = Array.isArray(data) ? data : (Array.isArray(data?.orders) ? data.orders : []);
        setOrders(normalizedOrders);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { orders, loading, error };
}
