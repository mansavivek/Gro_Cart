import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAddresses } from '../hooks/useAddresses';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { placeOrder } from '../services/orderService';
import { formatAddress } from '../utils/formatAddress';

function cardIcon(type) {
  const icons = { Visa: '💳', Mastercard: '💳', Amex: '💳', Rupay: '💳', UPI: '📱', 'Net Banking': '🏦' };
  return icons[type] || '💳';
}

function maskCard(num) {
  const clean = (num || '').replace(/\s/g, '');
  if (clean.length < 4) return num;
  return '**** ' + clean.slice(-4);
}

export default function CheckoutModal({ isOpen, onClose, initialAddress, initialPaymentMethod }) {
  const { cart, emptyCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addresses } = useAddresses();
  const { methods } = usePaymentMethods();

  const defaultAddress = initialAddress
    || addresses[0]
    || (user?.address ? { line1: user.address, city: '', state: '', pincode: '' } : null);

  const defaultPayment = initialPaymentMethod || methods[0] || null;

  const [selectedAddress, setSelectedAddress] = useState(defaultAddress);
  const [selectedPayment, setSelectedPayment] = useState(defaultPayment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync when props change (e.g. returning from address/payment pages)
  useEffect(() => {
    if (initialAddress) setSelectedAddress(initialAddress);
  }, [initialAddress]);

  useEffect(() => {
    if (initialPaymentMethod) setSelectedPayment(initialPaymentMethod);
  }, [initialPaymentMethod]);

  // Default to first address/payment if none selected yet
  useEffect(() => {
    if (!selectedAddress && addresses.length > 0) setSelectedAddress(addresses[0]);
  }, [addresses]);

  useEffect(() => {
    if (!selectedPayment && methods.length > 0) setSelectedPayment(methods[0]);
  }, [methods]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address.');
      return;
    }
    const addressStr = formatAddress(selectedAddress);

    const paymentStr = selectedPayment
      ? selectedPayment.cardType + (selectedPayment.cardNumber ? ' · ' + maskCard(selectedPayment.cardNumber) : '')
      : 'Cash on Delivery';

    setLoading(true);
    setError(null);
    try {
      await placeOrder({ delivery_address: addressStr, payment_method: paymentStr });
      await emptyCart();
      onClose();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Checkout</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors text-lg"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Delivery Address */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Delivery Address
              </h3>
              <button
                onClick={() => navigate('/addresses', { state: { selectMode: true } })}
                className="text-xs font-medium text-green-600 hover:text-green-700 hover:underline"
              >
                Change
              </button>
            </div>
            {selectedAddress ? (
              <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-2">
                <span className="text-base mt-0.5">📍</span>
                <div>
                  {selectedAddress.label && (
                    <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full mr-1">
                      {selectedAddress.label}
                    </span>
                  )}
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{selectedAddress.line1}</p>
                  {selectedAddress.line2 && <p className="text-sm text-gray-500">{selectedAddress.line2}</p>}
                  <p className="text-sm text-gray-500">
                    {[selectedAddress.city, selectedAddress.state, selectedAddress.pincode].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/addresses', { state: { selectMode: true } })}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-sm text-gray-400 hover:border-green-400 hover:text-green-600 transition-colors text-center"
              >
                + Add Delivery Address
              </button>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Payment Method
              </h3>
              <button
                onClick={() => navigate('/payment-methods', { state: { selectMode: true } })}
                className="text-xs font-medium text-green-600 hover:text-green-700 hover:underline"
              >
                {methods.length > 0 ? 'Change' : 'Add'}
              </button>
            </div>
            {methods.length > 0 ? (
              <div className="space-y-2">
                {methods.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      selectedPayment?.id === m.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPayment?.id === m.id}
                      onChange={() => setSelectedPayment(m)}
                      className="accent-green-600"
                    />
                    <span className="text-xl">{cardIcon(m.cardType)}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {m.cardType}
                        {m.cardNumber && ['Visa', 'Mastercard', 'Amex', 'Rupay'].includes(m.cardType)
                          ? ' · ' + maskCard(m.cardNumber)
                          : m.cardType === 'UPI' ? ' · ' + m.cardNumber : ''}
                      </p>
                      <p className="text-xs text-gray-500">{m.cardholderName}</p>
                    </div>
                  </label>
                ))}
                <button
                  onClick={() => navigate('/payment-methods', { state: { selectMode: true } })}
                  className="w-full text-sm text-green-600 hover:text-green-700 py-2 border-2 border-dashed border-gray-200 rounded-xl hover:border-green-300 transition-colors"
                >
                  + Add New Payment Method
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/payment-methods', { state: { selectMode: true } })}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-sm text-gray-400 hover:border-green-400 hover:text-green-600 transition-colors text-center"
              >
                + Add Payment Method
              </button>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Order Summary
            </h3>
            <div className="bg-gray-50 rounded-xl p-3 space-y-2">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product?.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-gray-800">
                    ${(item.product?.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span>${cart.total_price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100">
          <Button
            className="w-full"
            size="lg"
            onClick={handlePlaceOrder}
            disabled={loading || cart.items.length === 0}
          >
            {loading ? 'Placing Order…' : `Place Order · $${cart.total_price.toFixed(2)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
