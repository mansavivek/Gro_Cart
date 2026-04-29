import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { addPaymentMethod, fetchPaymentMethods } from '../services/paymentMethodService';

// Local form shape used for adding/editing card details in the UI.
const EMPTY_CARD = {
  holderName: '',
  brand: '',
  number: '',
  expiry: '',
};

// Convert the local form representation into the API payload shape.
function toMaskedCard(form) {
  return {
    card_holder_name: form.holderName,
    card_brand: form.brand || 'Card',
    card_number: form.number,
    expiry: form.expiry,
  };
}

/**
 * PaymentMethodsPage
 *
 * Lets the user manage saved payment cards. Supports adding a new
 * card, selecting a default card, and a simple edit flow. Backend
 * delete support is not implemented yet (shows a friendly message).
 */
export default function PaymentMethodsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_CARD);
  const [error, setError] = useState('');
  const pageBackgroundStyle = {
    backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuDeX4zOPo9TX3mkIqXejygJX8y9j01whBwv0ZKx080l-wfAJttySxhoIoNkAKEQS7lYt9gZkH3fcWUc-OTSSyc5WSWss1pXtjWpBi22Lkf5_syDMf1g_-Dm3sIoZ-hgsVs3_K32J6NUT11S3_WoqLe3O5ahFXC65EgH2rwf8mZNnqgDHB4lc7G0JKAYMdOw7M_F36tHRTDgGygRlz6ZWhC1gOlaiLstaG3z05Dxt3JlKDWNzagnylvAcIdG16Cp0TnbaR6j-P8UXKE)",
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setError('');
      const { data } = await fetchPaymentMethods();
      const list = Array.isArray(data) ? data : [];
      setItems(list);
      const active = list.find((item) => item.is_default) || list[0] || null;
      setSelectedId(active?.id || null);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load payment methods.');
    }
  };

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const startAdd = () => {
    setEditingId('new');
    setForm({ ...EMPTY_CARD });
  };

  const startEdit = (card) => {
    setEditingId(card.id);
    setForm({
      holderName: card.holderName || '',
      brand: card.brand || '',
      number: '',
      expiry: card.expiry || '',
    });
  };

  const saveCard = async () => {
    if (!form.holderName.trim() || !form.brand.trim() || !form.expiry.trim() || !form.number.trim()) {
      setError('Please fill all payment method fields.');
      return;
    }
    const nextCard = toMaskedCard(form);
    try {
      setError('');
      await addPaymentMethod(nextCard);
      setEditingId(null);
      setForm(EMPTY_CARD);
      await loadPayments();
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to save payment method.');
    }
  };

  const selectCard = (id) => {
    setSelectedId(id);
    if (location.state?.openCheckoutModal) {
      navigate(location.state?.returnTo || '/cart', { state: { openCheckoutModal: true } });
    }
  };

  const deleteCard = (id) => {
    // Backend delete endpoint is not available yet.
    setError('Delete payment method is not available from backend yet.');
  };

  const goBack = () => {
    const target = location.state?.returnTo || '/cart';
    navigate(target, { state: { openCheckoutModal: Boolean(location.state?.openCheckoutModal) } });
  };

  return (
    <MainLayout backgroundStyle={pageBackgroundStyle}>
      <div className="mx-auto max-w-5xl px-2 py-2">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Profile</p>
            <h1 className="mt-1 text-4xl font-headline font-extrabold text-on-surface">Payment Methods</h1>
            <p className="mt-2 text-sm text-on-surface-variant">Manage your cards and choose a default payment option.</p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-lg border border-outline-variant/30 px-4 py-2 text-sm font-semibold text-on-surface" onClick={goBack} type="button">
              Back
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary" onClick={startAdd} type="button">
              Add Card
            </button>
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4">
          {items.map((card) => {
            const active = card.id === selectedId;
            return (
              <div className={`rounded-xl border p-5 ${active ? 'border-primary bg-primary/5' : 'border-outline-variant/25 bg-surface-container-lowest'}`} key={card.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-on-surface">{card.card_brand} •••• {card.last4}</p>
                    <p className="mt-1 text-sm text-on-surface-variant">{card.card_holder_name} • Expires {card.expiry}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-md border border-outline-variant/25 px-3 py-1.5 text-xs font-semibold text-on-surface" onClick={() => startEdit({ ...card, holderName: card.card_holder_name, brand: card.card_brand })} type="button">
                      Edit
                    </button>
                    <button
                      aria-label="Delete payment method"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => deleteCard(card.id)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                    <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary" onClick={() => selectCard(card.id)} type="button">
                      {active ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isEditing ? (
          <div className="mt-8 rounded-xl border border-outline-variant/25 bg-surface-container-lowest p-6">
            <h2 className="text-xl font-headline font-extrabold text-on-surface mb-4">{editingId === 'new' ? 'Add Card' : 'Edit Card'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-sm text-on-surface" placeholder="Card holder name" value={form.holderName} name="card-holder-name" autoComplete="off" onChange={(e) => setForm((prev) => ({ ...prev, holderName: e.target.value }))} />
              <input className="rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-sm text-on-surface" placeholder="Card brand (Visa, Mastercard...)" value={form.brand} onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))} />
              <input className="rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-sm text-on-surface" placeholder="Card number" value={form.number} onChange={(e) => setForm((prev) => ({ ...prev, number: e.target.value }))} />
              <input className="rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-sm text-on-surface" placeholder="Expiry (MM/YY)" value={form.expiry} onChange={(e) => setForm((prev) => ({ ...prev, expiry: e.target.value }))} />
            </div>
            <div className="mt-5 flex gap-2">
              <button className="rounded-lg border border-outline-variant/30 px-4 py-2 text-sm font-semibold text-on-surface" onClick={() => setEditingId(null)} type="button">
                Cancel
              </button>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary" onClick={saveCard} type="button">
                Save Card
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
}