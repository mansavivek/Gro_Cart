import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/orderService';

const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'Cash on Delivery', 'UPI'];

export default function CheckoutPage() {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    delivery_address: user?.address || '',
    payment_method: PAYMENT_METHODS[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await placeOrder(form);
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Card className="p-4">
              <h2 className="font-semibold mb-3">Delivery Address</h2>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                value={form.delivery_address}
                onChange={(e) => setForm({ ...form, delivery_address: e.target.value })}
                required
                placeholder="Enter your delivery address"
              />
            </Card>

            <Card className="p-4">
              <h2 className="font-semibold mb-3">Payment Method</h2>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((method) => (
                  <label key={method} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value={method}
                      checked={form.payment_method === method}
                      onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                      className="accent-green-600"
                    />
                    <span className="text-sm">{method}</span>
                  </label>
                ))}
              </div>
            </Card>

            <Button type="submit" className="w-full" size="lg" disabled={loading || cart.items.length === 0}>
              {loading ? 'Placing Order…' : 'Place Order'}
            </Button>
          </form>

          {/* Summary */}
          <Card className="p-4 h-fit">
            <h2 className="font-semibold mb-3">Order Summary</h2>
            <div className="space-y-2 text-sm">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-600">{item.product?.name} × {item.quantity}</span>
                  <span>${(item.product?.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${cart.total_price.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
