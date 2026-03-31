import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Spinner from '../components/ui/Spinner';
import { getProduct } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const { cart, addItem, updateItem, removeItem } = useCart();
  const { user } = useAuth();
  const cartItem = cart.items.find((item) => item.product_id === product?.id);
  const pageBackgroundStyle = {
    backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuDeX4zOPo9TX3mkIqXejygJX8y9j01whBwv0ZKx080l-wfAJttySxhoIoNkAKEQS7lYt9gZkH3fcWUc-OTSSyc5WSWss1pXtjWpBi22Lkf5_syDMf1g_-Dm3sIoZ-hgsVs3_K32J6NUT11S3_WoqLe3O5ahFXC65EgH2rwf8mZNnqgDHB4lc7G0JKAYMdOw7M_F36tHRTDgGygRlz6ZWhC1gOlaiLstaG3z05Dxt3JlKDWNzagnylvAcIdG16Cp0TnbaR6j-P8UXKE)",
  };

  useEffect(() => {
    getProduct(id)
      .then(({ data }) => {
        setProduct(data);
        setSelectedImage(data.image_url || '');
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (cartItem) {
      setQty(cartItem.quantity);
    }
  }, [cartItem]);

  const handleAddToCart = async () => {
    if (!user) { window.location.href = '/login'; return; }
    if (cartItem) {
      await updateItem(cartItem.id, qty);
      return;
    }
    await addItem(product.id, qty);
  };

  const handleIncreaseQty = async () => {
    const maxQty = product?.quantity || 1;
    const nextQty = Math.min(maxQty, qty + 1);
    setQty(nextQty);

    if (cartItem) {
      await updateItem(cartItem.id, nextQty);
    }
  };

  const handleDecreaseQty = async () => {
    const nextQty = Math.max(1, qty - 1);
    setQty(nextQty);

    if (cartItem) {
      if (nextQty <= 0) {
        await removeItem(cartItem.id);
      } else {
        await updateItem(cartItem.id, nextQty);
      }
    }
  };

  if (loading) return <MainLayout backgroundStyle={pageBackgroundStyle}><Spinner /></MainLayout>;
  if (!product) return <MainLayout backgroundStyle={pageBackgroundStyle}><p className="text-center text-on-surface-variant">Product not found.</p></MainLayout>;

  const gallery = [
    ...(Array.isArray(product.image_urls) ? product.image_urls : []),
    selectedImage || product.image_url,
    product.image_url,
  ].filter(Boolean);

  const inStock = product.quantity > 0;
  const ratingValue = Number(product.avg_rating ?? 4.8);
  const filledStars = Math.round(Math.max(0, Math.min(5, ratingValue)));

  return (
    <MainLayout backgroundStyle={pageBackgroundStyle}>
      <div className="pt-2 pb-20 max-w-7xl mx-auto px-2 sm:px-4">
        <nav className="flex items-center gap-2 mb-8 text-xs font-medium uppercase tracking-wider text-slate-400 font-label">
          <Link to="/" className="hover:text-primary transition-colors">Shop</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link to="/" className="hover:text-primary transition-colors">{product.category?.name || 'Products'}</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface-variant">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-square rounded-xl bg-surface-container-low overflow-hidden group">
              {selectedImage ? (
                <img
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={selectedImage}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">🥦</div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {gallery.slice(0, 6).map((image, idx) => (
                <button
                  key={`${image}-${idx}`}
                  className={`aspect-square rounded-lg bg-surface-container-low overflow-hidden cursor-pointer hover:opacity-80 transition-opacity ${
                    image === selectedImage ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedImage(image)}
                  type="button"
                >
                  <img alt={`${product.name} preview ${idx + 1}`} className="w-full h-full object-cover" src={image} />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {product.category?.name || 'Groceries'}
                </span>
                {inStock ? (
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">IN STOCK</span>
                ) : (
                  <span className="text-xs font-bold text-error bg-error-container/20 px-2 py-0.5 rounded-full">OUT OF STOCK</span>
                )}
              </div>
              <h1 className="font-headline text-4xl font-extrabold text-on-surface leading-tight mb-2">{product.name}</h1>
              <div className="mb-3 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-0.5" aria-label={`Rating ${ratingValue} out of 5`}>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span
                      className="material-symbols-outlined text-amber-500 text-[18px]"
                      key={idx}
                      style={{ fontVariationSettings: `'FILL' ${idx < filledStars ? 1 : 0}` }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="font-semibold text-on-surface">{ratingValue.toFixed(1)}</span>
                <span className="text-on-surface-variant">{`(${product.reviews_count || 0} reviews)`}</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-headline font-black text-primary">${product.price.toFixed(2)}</span>
                <span className="text-xs text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">Fresh quality guaranteed</span>
              </div>
            </div>

            <p className="text-on-surface-variant leading-relaxed">
              {product.description || 'No detailed description is available for this product yet.'}
            </p>

            <div className="bg-surface-container-low rounded-xl p-6 border border-white/40">
              <h3 className="font-headline text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">nutrition</span>
                Nutrition Highlights
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-outline-variant/10">
                  <span className="text-sm text-on-surface-variant">Serving Size</span>
                  <span className="text-sm font-bold">1 unit</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-on-surface-variant">Category</span>
                  <span className="text-sm font-bold">{product.category?.name || 'General'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-surface-container-high rounded-lg px-2">
                  <button className="p-3 text-primary hover:scale-110 transition-transform" onClick={handleDecreaseQty} type="button">
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="w-12 text-center font-bold font-headline">{qty}</span>
                  <button className="p-3 text-primary hover:scale-110 transition-transform" onClick={handleIncreaseQty} type="button">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
                <button
                  className="flex-1 bg-primary text-on-primary font-headline font-bold py-4 px-8 rounded-lg shadow-lg shadow-primary/20 hover:bg-primary-dim active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
                  disabled={!inStock}
                  onClick={handleAddToCart}
                  type="button"
                >
                  <span className="material-symbols-outlined">shopping_bag</span>
                  {inStock ? (cartItem ? 'Update Cart' : 'Add to Cart') : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
