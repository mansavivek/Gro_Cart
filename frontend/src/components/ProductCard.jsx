import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product }) {
  const { cart, addItem, updateItem, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const cartItem = cart.items.find((item) => item.product_id === product.id);

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

  const handleIncrease = async () => {
    if (!cartItem) {
      await handleAddToCart();
      return;
    }
    await updateItem(cartItem.id, cartItem.quantity + 1);
  };

  const handleDecrease = async () => {
    if (!cartItem) return;
    if (cartItem.quantity <= 1) {
      await removeItem(cartItem.id);
      return;
    }
    await updateItem(cartItem.id, cartItem.quantity - 1);
  };

  return (
    <div
      className="group flex flex-col rounded-xl bg-white dark:bg-white/5 p-4 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-primary/20 cursor-pointer"
      onClick={(event) => {
        if (event.target.closest('button')) return;
        navigate(`/products/${product.id}`);
      }}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigate(`/products/${product.id}`);
        }
      }}
    >
      <Link to={`/products/${product.id}`}>
        <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <span className="material-symbols-outlined text-5xl text-gray-400">shopping_basket</span>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-1">
        {product.category && (
          <p className="text-xs font-bold uppercase text-gray-400">{product.category.name}</p>
        )}
        <Link to={`/products/${product.id}`}>
          <h3 className="mb-1 text-lg font-bold text-[#111813] dark:text-white">{product.name}</h3>
        </Link>
        <p className="mb-4 text-sm text-gray-500">{product.description || 'Fresh grocery item'}</p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-[#006837]">${product.price.toFixed(2)}</span>
          {cartItem ? (
            <div className="flex items-center justify-center bg-surface-container-low rounded-full px-2 py-1">
              <button
                className="w-8 h-8 flex items-center justify-center text-primary active:scale-90 transition-transform"
                onClick={handleDecrease}
                type="button"
                aria-label="Decrease quantity"
              >
                <span className="material-symbols-outlined text-lg">remove</span>
              </button>
              <span className="px-3 font-bold text-on-surface min-w-[2rem] text-center">{cartItem.quantity}</span>
              <button
                className="w-8 h-8 flex items-center justify-center text-primary active:scale-90 transition-transform"
                onClick={handleIncrease}
                disabled={product.quantity > 0 && cartItem.quantity >= product.quantity}
                type="button"
                aria-label="Increase quantity"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
          ) : (
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#006837] text-white transition-colors hover:bg-[#004d29] disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              type="button"
              aria-label={product.quantity === 0 ? 'Out of stock' : 'Add to cart'}
            >
              <span className="material-symbols-outlined">{product.quantity === 0 ? 'block' : 'add'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
