import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/ui/Spinner';
import { useProducts, useCategories } from '../hooks/useProducts';

function getCategoryIcon(categoryName = '') {
  const normalized = categoryName.toLowerCase();
  if (normalized.includes('produce')) return 'eco';
  if (normalized.includes('dairy') || normalized.includes('egg')) return 'water_drop';
  if (normalized.includes('meat') || normalized.includes('seafood')) return 'set_meal';
  if (normalized.includes('bakery')) return 'bakery_dining';
  if (normalized.includes('frozen')) return 'ac_unit';
  if (normalized.includes('drink') || normalized.includes('beverage')) return 'local_bar';
  if (normalized.includes('baby')) return 'child_care';
  if (normalized.includes('health') || normalized.includes('beauty')) return 'spa';
  return 'shopping_basket';
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { products, loading: productsLoading } = useProducts(selectedCategory);
  const { categories, loading: categoriesLoading } = useCategories();
  const pageBackgroundStyle = {
    backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuDeX4zOPo9TX3mkIqXejygJX8y9j01whBwv0ZKx080l-wfAJttySxhoIoNkAKEQS7lYt9gZkH3fcWUc-OTSSyc5WSWss1pXtjWpBi22Lkf5_syDMf1g_-Dm3sIoZ-hgsVs3_K32J6NUT11S3_WoqLe3O5ahFXC65EgH2rwf8mZNnqgDHB4lc7G0JKAYMdOw7M_F36tHRTDgGygRlz6ZWhC1gOlaiLstaG3z05Dxt3JlKDWNzagnylvAcIdG16Cp0TnbaR6j-P8UXKE)",
  };

  // Filter products by search query
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout
      backgroundStyle={pageBackgroundStyle}
      contentClassName="p-0"
      navbarProps={{
        showSearch: true,
        searchQuery,
        onSearchChange: setSearchQuery,
      }}
    >
      <div className="flex flex-1">
        <aside className="hidden lg:flex w-64 flex-col border-r border-gray-200 bg-white p-6 sticky top-[65px] h-screen overflow-y-auto flex-shrink-0">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 px-4">Categories</p>
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left w-full ${
                selectedCategory === null
                  ? 'bg-primary/10 text-[#111813] border-l-4 border-primary'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="material-symbols-outlined">apps</span>
              <span className="font-medium">All Products</span>
            </button>

            {categoriesLoading ? (
              <div className="p-4">
                <Spinner size="sm" />
              </div>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left w-full ${
                    selectedCategory === cat.id
                      ? 'bg-primary/10 text-[#111813] border-l-4 border-primary'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="material-symbols-outlined">{cat.icon || getCategoryIcon(cat.name)}</span>
                  <span className="font-medium">{cat.name}</span>
                </button>
              ))
            )}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[#f6f8f6]">
          <div className="mx-auto max-w-[1100px] space-y-10 font-body">
        {/* Hero Banner - Featured Deals */}
        <section className="relative h-64 lg:h-80 w-full overflow-hidden rounded-2xl bg-[#111813]">
          <div
            className="absolute inset-0 opacity-60 bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://lh3.googleusercontent.com/aida-public/AB6AXuBk1xkvPXgXn-W28WsegvnRHGLGdz2DkbDSgk1KTbw9cLInliCM_F5axMKAcGoC-r-qeassvAV_N2z0w6a1bV1cCSF_Io5rBlslCDTBWXe7ousLoA54dfcb39F6U0ZYRMGkl5G4awS1A_psFmoIfbI2pzMRSjY0vK5-FB5NVNm2opPqPsRsfmlCKwtzUXtn9kJWqOrtauI86ApPA99VV7lYfTimAYqw7yIh5iUtQao_1lZi4KVEyGvykWY0Rf-K6q9aFCn1CeWquQ8)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

          <div className="relative flex h-full flex-col justify-center px-8 lg:px-16 text-white max-w-2xl">
            <span className="mb-3 inline-block rounded-full bg-on-primary/20 px-4 py-1 text-xs font-bold tracking-wider uppercase backdrop-blur-md w-fit">
              Seasonal Picks
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold font-headline mb-3 tracking-tight">
              Farm Fresh, Always Ready
            </h1>
            <p className="text-white/90 text-lg mb-6 max-w-md">
              Curated selection of premium organic produce and specialty groceries, delivered fresh to your door.
            </p>
            <button
              onClick={() => {
                const productsSection = document.getElementById('products-section');
                productsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-lg bg-primary px-8 py-3 text-base font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 w-fit inline-flex items-center"
            >
              Shop Now
              <span className="material-symbols-outlined ml-2">arrow_forward</span>
            </button>
          </div>
        </section>
          {/* Main Content – Products Grid */}
          <section id="products-section" className="space-y-8">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#111813]">
                  {selectedCategory
                    ? categories.find((c) => c.id === selectedCategory)?.name
                    : 'Popular Grocery Items'}
                </h2>
              </div>
            </div>

            {/* Products Grid */}
            {productsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Spinner />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl p-16 text-center border border-outline-variant/10">
                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">shopping_basket</span>
                <h3 className="text-xl font-bold text-on-surface mb-2">No items found</h3>
                <p className="text-on-surface-variant">
                  {searchQuery ? 'Try adjusting your search query' : 'No products available in this category yet.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
          </div>
          </main>
      </div>
    </MainLayout>
  );
}
