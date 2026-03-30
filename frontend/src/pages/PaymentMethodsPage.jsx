import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { usePaymentMethods } from '../hooks/usePaymentMethods';

const emptyForm = { cardholderName: '', cardNumber: '', expiry: '', cardType: 'Visa' };
const CARD_TYPES = ['Visa', 'Mastercard', 'Amex', 'Rupay', 'UPI', 'Net Banking'];

function maskCard(num) {
  const clean = num.replace(/\s/g, '');
  if (clean.length < 4) return num;
  return '**** **** **** ' + clean.slice(-4);
}

function cardIcon(type) {
  const icons = { Visa: '💳', Mastercard: '💳', Amex: '💳', Rupay: '💳', UPI: '📱', 'Net Banking': '🏦' };
  return icons[type] || '💳';
}

export default function PaymentMethodsPage() {
  const { methods, addMethod, updateMethod, deleteMethod } = usePaymentMethods();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const location = useLocation();
  const navigate = useNavigate();

  const selectMode = location.state?.selectMode === true;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      updateMethod(editId, form);
    } else {
      addMethod(form);
    }
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
    // After adding in selectMode, go back with the new list reloaded
    if (selectMode) {
      navigate('/cart', { state: { openCheckout: true } });
    }
  };

  const handleEdit = (m) => {
    setForm({
      cardholderName: m.cardholderName || '',
      cardNumber: m.cardNumber || '',
      expiry: m.expiry || '',
      cardType: m.cardType || 'Visa',
    });
    setEditId(m.id);
    setShowForm(true);
  };

  const handleSelect = (m) => {
    navigate('/cart', { state: { openCheckout: true, selectedPaymentMethod: m } });
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {selectMode ? 'Select Payment Method' : 'Payment Methods'}
            </h1>
            {selectMode && (
              <p className="text-sm text-gray-500 mt-1">Choose a payment method for your order</p>
            )}
          </div>
          {!selectMode && (
            <Button
              size="sm"
              onClick={() => {
                setForm(emptyForm);
                setEditId(null);
                setShowForm(!showForm);
              }}
            >
              {showForm ? 'Cancel' : '+ Add Card'}
            </Button>
          )}
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <Card className="p-5 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">
              {editId ? 'Edit Payment Method' : 'Add Payment Method'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
                <select
                  name="cardType"
                  value={form.cardType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {CARD_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Cardholder Name"
                name="cardholderName"
                value={form.cardholderName}
                onChange={handleChange}
                required
                placeholder="Name on card"
              />
              {['Visa', 'Mastercard', 'Amex', 'Rupay'].includes(form.cardType) && (
                <>
                  <Input
                    label="Card Number"
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleChange}
                    required
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  <Input
                    label="Expiry (MM/YY)"
                    name="expiry"
                    value={form.expiry}
                    onChange={handleChange}
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </>
              )}
              {form.cardType === 'UPI' && (
                <Input
                  label="UPI ID"
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={handleChange}
                  required
                  placeholder="yourname@upi"
                />
              )}
              {form.cardType === 'Net Banking' && (
                <Input
                  label="Bank Name"
                  name="cardholderName"
                  value={form.cardholderName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. HDFC Bank"
                />
              )}
              <div className="flex gap-2 pt-1">
                <Button type="submit">{editId ? 'Save Changes' : 'Add'}</Button>
                <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Methods List */}
        {methods.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">💳</p>
            <p className="font-medium text-gray-500">No payment methods saved</p>
            <p className="text-sm mt-1">Add a card to speed up checkout</p>
            <Button
              className="mt-4"
              onClick={() => {
                setShowForm(true);
                setForm(emptyForm);
                setEditId(null);
              }}
            >
              + Add Payment Method
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {methods.map((m) => (
              <Card key={m.id} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cardIcon(m.cardType)}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {m.cardType}
                        {m.cardNumber && ['Visa', 'Mastercard', 'Amex', 'Rupay'].includes(m.cardType)
                          ? ' · ' + maskCard(m.cardNumber)
                          : m.cardNumber ? ' · ' + m.cardNumber : ''}
                      </p>
                      <p className="text-xs text-gray-500">{m.cardholderName}</p>
                      {m.expiry && <p className="text-xs text-gray-400">Expires {m.expiry}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end shrink-0">
                    {selectMode ? (
                      <Button size="sm" onClick={() => handleSelect(m)}>
                        Select
                      </Button>
                    ) : (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(m)}>
                          Edit
                        </Button>
                        <button
                          onClick={() => deleteMethod(m.id)}
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add button in select mode */}
        {selectMode && (
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setShowForm(true);
                setForm(emptyForm);
                setEditId(null);
              }}
            >
              + Add New Payment Method
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
