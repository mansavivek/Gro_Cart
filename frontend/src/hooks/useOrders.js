import { useState, useEffect } from 'react';
import { getOrderHistory } from '../services/orderService';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOrderHistory()
      .then(({ data }) => setOrders(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { orders, loading, error };
}
