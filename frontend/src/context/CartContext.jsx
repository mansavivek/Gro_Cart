import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total_items: 0, total_price: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await getCart();
      setCart(data);
    } catch {
      // ignore auth errors – interceptor handles redirect
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      await addToCart({ product_id: productId, quantity });
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId, quantity) => {
    setLoading(true);
    try {
      await updateCartItem(itemId, { quantity });
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    setLoading(true);
    try {
      await removeCartItem(itemId);
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const emptyCart = async () => {
    setLoading(true);
    try {
      await clearCart();
      setCart({ items: [], total_items: 0, total_price: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addItem, updateItem, removeItem, emptyCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
