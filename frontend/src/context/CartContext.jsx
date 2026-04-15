import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total_items: 0, total_price: 0 });
  const [loading, setLoading] = useState(false);

  const buildCartWithTotals = (items) => {
    const safeItems = Array.isArray(items) ? items : [];
    const total_items = safeItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    const total_price = safeItems.reduce(
      (sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.product?.price) || 0)),
      0
    );

    return {
      items: safeItems,
      total_items,
      total_price: Number(total_price.toFixed(2)),
    };
  };

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
    if (user) {
     setCart({ items: [], total_items: 0, total_price: 0 });
     fetchCart();
    } else  {
      setCart({ items: [], total_items: 0, total_price: 0 });
    }
  }, [user,fetchCart]);

  async function addItem(productId, quantity = 1) {
    setLoading(true);
    try {
      await addToCart({ product_id: productId, quantity });
      await fetchCart();
    } finally {
      setLoading(false);
    }
  }

  const updateItem = async (itemId, quantity) => {
    const previousCart = cart;
    setCart((prev) => {
      const nextItems = prev.items.map((item) => (
        item.id === itemId ? { ...item, quantity } : item
      ));
      return buildCartWithTotals(nextItems);
    });

    try {
      await updateCartItem(itemId, { quantity });
    } catch (error) {
      setCart(previousCart);
      throw error;
    }
  };

  const removeItem = async (itemId) => {
    const previousCart = cart;
    setCart((prev) => {
      const nextItems = prev.items.filter((item) => item.id !== itemId);
      return buildCartWithTotals(nextItems);
    });

    try {
      await removeCartItem(itemId);
    } catch (error) {
      setCart(previousCart);
      throw error;
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
