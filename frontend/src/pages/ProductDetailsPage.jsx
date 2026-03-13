import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { getProduct } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
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
    alert('Added to cart!');
  };

  if (loading) return <MainLayout><Spinner /></MainLayout>;
  if (!product) return <MainLayout><p className="text-center text-gray-500">Product not found.</p></MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-xl h-80 flex items-center justify-center">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover rounded-xl" />
            ) : (
              <span className="text-8xl">🥦</span>
            )}
          </div>

          <div className="flex flex-col justify-center gap-4">
            {product.category && <Badge color="green">{product.category.name}</Badge>}
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-gray-500">{product.description || 'No description available.'}</p>
            <p className="text-3xl font-bold text-green-600">${product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500">
              {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
            </p>

            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >−</button>
                <span className="px-4 py-2 text-sm font-medium">{qty}</span>
                <button
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={() => setQty(Math.min(product.quantity, qty + 1))}
                >+</button>
              </div>
              <Button onClick={handleAddToCart} disabled={product.quantity === 0} size="lg">
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
