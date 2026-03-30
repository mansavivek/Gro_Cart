import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/orderService';

const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'Cash on Delivery', 'UPI'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    delivery_address: user?.address || '',
    payment_method: PAYMENT_METHODS[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleSubmit = async () => {
    if (!form.delivery_address.trim()) {
      setError('Please provide a valid delivery address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await placeOrder(form);
      await fetchCart();
      setOrderPlaced(true);
      setTimeout(() => {
        navigate('/orders');
      }, 1400);
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <MainLayout>
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
          <div className="bg-surface-container-lowest w-full max-w-xl mx-auto rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.15)] overflow-hidden flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
              <span className="relative material-symbols-outlined text-7xl text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-on-surface mb-2">Order Placed Successfully</h2>
            <p className="text-on-surface-variant text-sm">Redirecting to your order history...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
        <div className="bg-surface-container-lowest w-full max-w-xl mx-auto rounded-xl shadow-[0_20px_50px_rgba(43,47,49,0.15)] overflow-hidden flex flex-col">
          <div className="px-6 py-5 flex justify-between items-center bg-surface-container-low/50">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary mb-1 block">Checkout Process</span>
              <h2 className="text-xl font-extrabold text-on-surface tracking-tight">Payment Summary</h2>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">payments</span>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
                <p className="font-semibold">Checkout failed</p>
                <p>{error}</p>
              </div>
            )}

            <section>
              <div className="flex justify-between items-end mb-3">
                <h3 className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary">location_on</span>
                  Delivery Address
                </h3>
              </div>

              <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/10 flex gap-4">
                <div className="flex-1">
                  <p className="font-bold text-on-surface">{user?.name || 'Customer'}</p>
                  <textarea
                    className="w-full mt-2 bg-transparent border-none rounded text-sm text-on-surface-variant leading-relaxed focus:ring-2 focus:ring-primary/20"
                    onChange={(e) => setForm({ ...form, delivery_address: e.target.value })}
                    placeholder="Enter delivery address"
                    rows={3}
                    value={form.delivery_address}
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-on-surface-variant mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-primary">payments</span>
                Payment Method
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const active = form.payment_method === method;
                  return (
                    <label
                      className={`relative flex items-center p-4 rounded-lg border cursor-pointer transition-all ${active ? 'border-primary bg-primary-container/10' : 'border-outline-variant/30 hover:bg-surface-container-high/40'}`}
                      key={method}
                    >
                      <input
                        checked={active}
                        className="hidden"
                        name="payment"
                        onChange={() => setForm({ ...form, payment_method: method })}
                        type="radio"
                      />
                      <span className="material-symbols-outlined text-on-surface-variant mr-3">credit_card</span>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${active ? 'text-on-primary-container' : 'text-on-surface'}`}>{method}</p>
                        <p className="text-xs text-on-surface-variant">Secure checkout enabled</p>
                      </div>
                      {active ? <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> : null}
                    </label>
                  );
                })}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-on-surface-variant mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-primary">receipt_long</span>
                Order Summary
              </h3>

              <div className="bg-surface-container-low rounded-lg p-4 space-y-3">
                <div className="space-y-2 pt-1">
                  {cart.items.map((item) => (
                    <div className="flex justify-between items-center text-sm" key={item.id}>
                      <span className="text-on-surface-variant">{item.product?.name} x {item.quantity}</span>
                      <span className="font-medium">${(item.product?.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant">Delivery Fee</span>
                    <span className="text-primary font-medium">FREE</span>
                  </div>
                  <div className="pt-3 mt-2 border-t border-dashed border-outline-variant/30 flex justify-between items-center">
                    <span className="text-base font-extrabold text-on-surface">Total Amount</span>
                    <span className="text-xl font-black text-primary">${cart.total_price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="px-6 py-6 bg-surface-container-lowest border-t border-outline-variant/10">
            <button
              className="w-full bg-primary hover:bg-primary-dim text-on-primary font-headline font-extrabold text-lg py-4 rounded-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
              disabled={loading || cart.items.length === 0}
              onClick={handleSubmit}
              type="button"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
