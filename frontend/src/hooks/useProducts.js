import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../services/productService';

/**
 * useProducts
 *
 * Loads products optionally filtered by `categoryId`. Returns
 * `products`, `loading` and `error`.
 */
export function useProducts(categoryId) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = categoryId ? { category_id: categoryId } : {};
    getProducts(params)
      .then(({ data }) => setProducts(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [categoryId]);

  return { products, loading, error };
}

/**
 * useCategories
 *
 * Loads product categories used for filtering and navigation.
 */
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}
