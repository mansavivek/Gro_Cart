import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import CheckoutModal from '../components/CheckoutModal';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, loading, updateItem, removeItem, emptyCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutInitialAddress, setCheckoutInitialAddress] = useState(null);
  const [checkoutInitialPayment, setCheckoutInitialPayment] = useState(null);

  // Re-open checkout modal when returning from addresses/payment-methods page
  useEffect(() => {
    if (location.state?.openCheckout) {
      setCheckoutInitialAddress(location.state.selectedAddress || null);
      setCheckoutInitialPayment(location.state.selectedPaymentMethod || null);
      setShowCheckout(true);
      // Clear state so it doesn't re-open on subsequent renders
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  if (loading) return <MainLayout><Spinner /></MainLayout>;

  if (cart.items.length === 0) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
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
          <button onClick={emptyCart} className="text-sm text-red-500 hover:text-red-700 font-medium">
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 h-16 w-16 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100">
                    {item.product?.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-full w-full object-cover rounded-xl"
                      />
                    ) : (
                      <span className="text-2xl">🥦</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{item.product?.name}</p>
                    <p className="text-green-600 font-bold text-sm mt-0.5">
                      ${item.product?.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 text-sm font-bold"
                        onClick={() => updateItem(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="px-3 py-1.5 text-sm font-semibold text-gray-800 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 text-sm font-bold"
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors ml-1 text-lg"
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order summary */}
          <Card className="p-5 h-fit">
            <h2 className="text-base font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Items ({cart.total_items})</span>
                <span className="font-medium text-gray-800">${cart.total_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <hr className="border-gray-100 my-1" />
              <div className="flex justify-between font-bold text-base text-gray-800">
                <span>Total</span>
                <span>${cart.total_price.toFixed(2)}</span>
              </div>
            </div>
            <Button
              className="w-full mt-4"
              size="lg"
              onClick={() => setShowCheckout(true)}
            >
              Proceed to Checkout
            </Button>
          </Card>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => {
          setShowCheckout(false);
          setCheckoutInitialAddress(null);
          setCheckoutInitialPayment(null);
        }}
        initialAddress={checkoutInitialAddress}
        initialPaymentMethod={checkoutInitialPayment}
      />
    </MainLayout>
  );
}
