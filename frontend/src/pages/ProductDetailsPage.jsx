import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { getProduct } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ORIGINAL_PRICE_MARKUP = 1.15;

// Static star rendering (no real ratings data from backend; shown as UI element)
function StarRating({ rating = 4.5, count = 128 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          if (i < full) return <span key={i} className="text-yellow-400 text-base">★</span>;
          if (i === full && half) return <span key={i} className="text-yellow-300 text-base">★</span>;
          return <span key={i} className="text-gray-200 text-base">★</span>;
        })}
      </div>
      <span className="text-sm font-semibold text-gray-700">{rating}</span>
      <span className="text-sm text-gray-400">({count} reviews)</span>
    </div>
  );
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    getProduct(id)
      .then(({ data }) => setProduct(data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { window.location.href = '/login'; return; }
    await addItem(product.id, qty);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) return <MainLayout><div className="py-20"><Spinner /></div></MainLayout>;
  if (!product) {
    return (
      <MainLayout>
        <p className="text-center text-gray-500 py-20">Product not found.</p>
      </MainLayout>
    );
  }

  const inStock = product.quantity > 0;

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1.5">
        <Link to="/" className="hover:text-green-600">Home</Link>
        <span>/</span>
        {product.category && (
          <>
            <span className="hover:text-green-600 cursor-pointer">{product.category.name}</span>
            <span>/</span>
          </>
        )}
        <span className="text-gray-600 font-medium">{product.name}</span>
      </nav>

      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="bg-gray-50 rounded-2xl h-80 md:h-96 flex items-center justify-center border border-gray-100 overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-9xl select-none">🥦</span>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-4 py-2">
            {/* Category + Stock badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.category && (
                <Badge color="green">{product.category.name}</Badge>
              )}
              {inStock ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-50 text-red-500 border border-red-200 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                  Out of Stock
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Star Ratings */}
            <StarRating rating={4.5} count={128} />

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-green-600">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ${(product.price * ORIGINAL_PRICE_MARKUP).toFixed(2)}
              </span>
              <span className="text-xs font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">
                15% off
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                {product.description}
              </p>
            )}

            {/* Quantity + Add to Cart */}
            {inStock && (
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <button
                    className="px-3.5 py-2.5 text-gray-500 hover:bg-gray-50 font-bold text-base disabled:opacity-30"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                  >
                    −
                  </button>
                  <span className="px-5 py-2.5 text-sm font-bold text-gray-800 border-x border-gray-200 min-w-[3rem] text-center">
                    {qty}
                  </span>
                  <button
                    className="px-3.5 py-2.5 text-gray-500 hover:bg-gray-50 font-bold text-base disabled:opacity-30"
                    onClick={() => setQty(qty + 1)}
                    disabled={qty >= product.quantity}
                  >
                    +
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1"
                  variant={addedToCart ? 'secondary' : 'primary'}
                >
                  {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                </Button>
              </div>
            )}

            {!inStock && (
              <Button disabled size="lg" className="mt-2 w-full">
                Out of Stock
              </Button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
