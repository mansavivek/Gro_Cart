import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/orderService';
import {
  formatAddress,
  getAddressBook,
  getPaymentMethods,
  savePaymentMethods,
} from '../services/profileStore';

export default function CheckoutModal({ open, onClose, cart, fetchCart, user }) {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    holderName: '',
    brand: '',
    number: '',
    expiry: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (!open || !user) return;
    const addressBook = getAddressBook(user);
    const methods = getPaymentMethods(user);
    setAddresses(addressBook.items);
    setSelectedAddressId(addressBook.selectedId);
    setCards(methods.items);
    setSelectedCardId(methods.selectedId);
    setPaymentForm({
      holderName:'',
      brand: '',
      number: '',
      expiry: '',
    });
    setShowAddPaymentForm(false);
    setError('');
    setOrderPlaced(false);
  }, [open, user]);

  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === selectedAddressId) || null,
    [addresses, selectedAddressId]
  );
  const selectedCard = useMemo(
    () => cards.find((card) => card.id === selectedCardId) || null,
    [cards, selectedCardId]
  );

  if (!open) return null;

  const handleCardSelect = (id) => {
    setSelectedCardId(id);
    savePaymentMethods(user, { items: cards, selectedId: id });
  };

  const handleAddPaymentMethod = () => {
    if (!paymentForm.holderName.trim() || !paymentForm.brand.trim() || !paymentForm.expiry.trim()) {
      setError('Please complete the payment method form before saving.');
      return;
    }

    const sanitized = paymentForm.number.replace(/\D/g, '');
    const next = {
      id: `card-${Date.now()}`,
      holderName: paymentForm.holderName,
      brand: paymentForm.brand,
      last4: sanitized.slice(-4) || '0000',
      expiry: paymentForm.expiry,
    };
    const nextCards = [next, ...cards];
    setCards(nextCards);
    setSelectedCardId(next.id);
    savePaymentMethods(user, { items: nextCards, selectedId: next.id });
    setPaymentForm({ holderName: user?.name || '', brand: '', number: '', expiry: '' });
    setShowAddPaymentForm(false);
    setError('');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please choose a delivery address.');
      return;
    }
    if (!selectedCard) {
      setError('Please choose a payment method.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await placeOrder({
        delivery_address: formatAddress(selectedAddress),
        payment_method: `${selectedCard.brand} •••• ${selectedCard.last4}`,
      });
      await fetchCart();
      setOrderPlaced(true);
      setTimeout(() => {
        onClose();
        navigate('/orders');
      }, 1400);
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-surface-container bg-white shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
        {orderPlaced ? (
          <div className="px-6 py-16 text-center">
            <div className="relative mb-6 inline-flex">
              <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
              <span className="relative material-symbols-outlined text-7xl text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <h2 className="text-2xl font-headline font-extrabold text-on-surface">Order Placed Successfully</h2>
            <p className="mt-2 text-sm text-on-surface-variant">Redirecting to your order history...</p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between border-b border-surface-container px-6 py-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Checkout</p>
                <h2 className="text-2xl font-headline font-extrabold text-on-surface">Payment Summary</h2>
              </div>
              <button
                aria-label="Close checkout"
                className="h-9 w-9 rounded-full text-on-surface-variant hover:bg-surface-container-high"
                onClick={onClose}
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-6 space-y-7">
              {error ? (
                <div className="rounded-lg border border-error/20 bg-error-container/30 p-3 text-sm text-error">
                  {error}
                </div>
              ) : null}

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-on-surface">Delivery Address</h3>
                  <button
                    className="text-sm font-semibold text-primary hover:text-primary-dim"
                    onClick={() => {
                      onClose();
                      navigate('/addresses', { state: { returnTo: '/cart', openCheckoutModal: true } });
                    }}
                    type="button"
                  >
                    Change
                  </button>
                </div>
                {selectedAddress ? (
                  <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                    <p className="text-sm font-semibold text-on-surface">{selectedAddress.label} - {selectedAddress.recipient}</p>
                    <p className="mt-1 text-xs text-on-surface-variant">{formatAddress(selectedAddress)}</p>
                  </div>
                ) : (
                  <button
                    className="w-full rounded-lg border border-dashed border-outline-variant/40 px-4 py-3 text-left text-sm text-primary"
                    onClick={() => {
                      onClose();
                      navigate('/addresses', { state: { returnTo: '/cart', openCheckoutModal: true } });
                    }}
                    type="button"
                  >
                    Add address
                  </button>
                )}
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-on-surface">Payment Methods</h3>
                  <button
                    className="text-sm font-semibold text-primary hover:text-primary-dim"
                    onClick={() => setShowAddPaymentForm((prev) => !prev)}
                    type="button"
                  >
                    {showAddPaymentForm ? 'Hide Form' : 'Add New Payment Method'}
                  </button>
                </div>
                <div className="space-y-2 rounded-lg border border-outline-variant/25 bg-surface-container-low px-4 py-3">
                  {cards.map((card) => {
                    const active = card.id === selectedCardId;
                    return (
                      <label className="flex cursor-pointer items-start gap-3 py-2" key={card.id}>
                        <input
                          checked={active}
                          className="mt-1 h-4 w-4 accent-primary"
                          name="payment-method"
                          onChange={() => handleCardSelect(card.id)}
                          type="radio"
                        />
                        <span className="text-sm text-on-surface">
                          <span className="block font-semibold">{card.brand} •••• {card.last4}</span>
                          <span className="block text-xs text-on-surface-variant">{card.holderName} • Expires {card.expiry}</span>
                        </span>
                      </label>
                    );
                  })}
                  {cards.length === 0 ? <p className="text-xs text-on-surface-variant">No payment methods yet. Add one below.</p> : null}
                </div>

                {showAddPaymentForm ? (
                  <div className="mt-3 rounded-lg border border-outline-variant/25 bg-white p-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <input
                        className="rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-sm text-on-surface"
                        onChange={(e) => setPaymentForm((prev) => ({ ...prev, holderName: e.target.value }))}
                        placeholder="Card holder name"
                        value={paymentForm.holderName}
                      />

                      <input
                        className="rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-sm text-on-surface"
                        onChange={(e) => setPaymentForm((prev) => ({ ...prev, brand: e.target.value }))}
                        placeholder="Card brand (Visa, Mastercard...)"
                        value={paymentForm.brand}
                      />
                      <input
                        className="rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-sm text-on-surface"
                        onChange={(e) => setPaymentForm((prev) => ({ ...prev, number: e.target.value }))}
                        placeholder="Card number"
                        value={paymentForm.number}
                      />
                      <input
                        className="rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-sm text-on-surface"
                        onChange={(e) => setPaymentForm((prev) => ({ ...prev, expiry: e.target.value }))}
                        placeholder="Expiry (MM/YY)"
                        value={paymentForm.expiry}
                      />
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
                        onClick={handleAddPaymentMethod}
                        type="button"
                      >
                        Save Payment Method
                      </button>
                    </div>
                  </div>
                ) : null}
              </section>

              <section>
                <h3 className="mb-3 text-sm font-bold text-on-surface">Order Summary</h3>
                <div className="rounded-lg bg-surface-container-low px-4 py-4">
                  {cart.items.map((item) => (
                    <div className="mb-2 flex items-center justify-between text-sm" key={item.id}>
                      <span className="text-on-surface-variant">{item.product?.name} x {item.quantity}</span>
                      <span className="font-semibold text-on-surface">${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="mt-3 border-t border-outline-variant/20 pt-3 flex items-center justify-between">
                    <span className="font-semibold text-on-surface">Total</span>
                    <span className="text-xl font-black text-primary">${cart.total_price.toFixed(2)}</span>
                  </div>
                </div>
              </section>
            </div>

            <div className="border-t border-surface-container px-6 py-5">
              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-lg font-extrabold text-on-primary hover:bg-primary-dim disabled:opacity-60"
                disabled={loading || cart.items.length === 0}
                onClick={handlePlaceOrder}
                type="button"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}