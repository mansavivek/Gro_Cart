import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, loading, updateItem, removeItem, emptyCart } = useCart();

  if (loading) return <MainLayout><Spinner /></MainLayout>;

  if (cart.items.length === 0) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
          <Link to="/">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
          <button onClick={emptyCart} className="text-sm text-red-500 hover:text-red-700">
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 h-16 w-16 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.product?.image_url ? (
                      <img src={item.product.image_url} alt={item.product.name} className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-2xl">🥦</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.product?.name}</p>
                    <p className="text-green-600 font-semibold">${item.product?.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-sm"
                        onClick={() => updateItem(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >−</button>
                      <span className="px-3 py-1 text-sm">{item.quantity}</span>
                      <button
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-sm"
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                      >+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">
                      ✕
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order summary */}
          <Card className="p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Items ({cart.total_items})</span>
                <span>${cart.total_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>${cart.total_price.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout" className="block mt-4">
              <Button className="w-full" size="lg">Proceed to Checkout</Button>
            </Link>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
