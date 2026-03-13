import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/ui/Spinner';
import { useProducts, useCategories } from '../hooks/useProducts';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { products, loading: productsLoading } = useProducts(selectedCategory);
  const { categories, loading: categoriesLoading } = useCategories();

  return (
    <MainLayout>
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-400 rounded-2xl p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Fresh Groceries Delivered 🚀</h1>
        <p className="text-green-100">Order fresh produce, dairy, bakery, and more — right to your door.</p>
      </div>

      {/* Categories */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Categories</h2>
        {categoriesLoading ? (
          <Spinner size="sm" />
        ) : (
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Products grid */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {selectedCategory
            ? categories.find((c) => c.id === selectedCategory)?.name
            : 'All Products'}
        </h2>
        {productsLoading ? (
          <Spinner />
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">🥕</p>
            <p>No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
}
