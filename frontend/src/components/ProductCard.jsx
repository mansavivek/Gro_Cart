import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    try {
      await addItem(product.id, 1);
    } catch (e) {
      alert('Failed to add to cart');
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/products/${product.id}`}>
        <div className="bg-gray-100 h-48 flex items-center justify-center">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-5xl">🥦</span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-green-600 mb-1">{product.name}</h3>
        </Link>
        {product.category && (
          <p className="text-xs text-gray-500 mb-2">{product.category.name}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</span>
          <Button size="sm" onClick={handleAddToCart} disabled={product.quantity === 0}>
            {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
