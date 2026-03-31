import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { getPaymentMethods, savePaymentMethods } from '../services/profileStore';

const EMPTY_CARD = {
  holderName: '',
  brand: '',
  number: '',
  expiry: '',
};

function toMaskedCard(form) {
  const sanitized = form.number.replace(/\D/g, '');
  return {
    holderName: form.holderName,
    brand: form.brand || 'Card',
    last4: sanitized.slice(-4) || '0000',
    expiry: form.expiry,
  };
}

export default function PaymentMethodsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_CARD);
  const pageBackgroundStyle = {
    backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuDeX4zOPo9TX3mkIqXejygJX8y9j01whBwv0ZKx080l-wfAJttySxhoIoNkAKEQS7lYt9gZkH3fcWUc-OTSSyc5WSWss1pXtjWpBi22Lkf5_syDMf1g_-Dm3sIoZ-hgsVs3_K32J6NUT11S3_WoqLe3O5ahFXC65EgH2rwf8mZNnqgDHB4lc7G0JKAYMdOw7M_F36tHRTDgGygRlz6ZWhC1gOlaiLstaG3z05Dxt3JlKDWNzagnylvAcIdG16Cp0TnbaR6j-P8UXKE)",
  };

  useEffect(() => {
    if (!user) return;
    const methods = getPaymentMethods(user);
    setItems(methods.items);
    setSelectedId(methods.selectedId);
  }, [user]);

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const startAdd = () => {
    setEditingId('new');
    setForm({ ...EMPTY_CARD, holderName: user?.name || '' });
  };

  const startEdit = (card) => {
    setEditingId(card.id);
    setForm({
      holderName: card.holderName || '',
      brand: card.brand || '',
      number: card.last4 ? `**** **** **** ${card.last4}` : '',
      expiry: card.expiry || '',
    });
  };

  const saveCard = () => {
    if (!form.holderName.trim() || !form.brand.trim() || !form.expiry.trim()) return;
    const nextCard = toMaskedCard(form);
    const id = editingId === 'new' ? `card-${Date.now()}` : editingId;
    const nextItems = editingId === 'new'
      ? [...items, { id, ...nextCard }]
      : items.map((item) => (item.id === id ? { ...item, ...nextCard } : item));
    const nextSelectedId = selectedId || id;

    setItems(nextItems);
    setSelectedId(nextSelectedId);
    savePaymentMethods(user, { items: nextItems, selectedId: nextSelectedId });
    setEditingId(null);
    setForm(EMPTY_CARD);
  };

  const selectCard = (id) => {
    setSelectedId(id);
    savePaymentMethods(user, { items, selectedId: id });
    if (location.state?.openCheckoutModal) {
      navigate(location.state?.returnTo || '/cart', { state: { openCheckoutModal: true } });
    }
  };

  const deleteCard = (id) => {
    const nextItems = items.filter((item) => item.id !== id);
    const nextSelectedId = selectedId === id ? nextItems[0]?.id || null : selectedId;
    setItems(nextItems);
    setSelectedId(nextSelectedId);
    savePaymentMethods(user, { items: nextItems, selectedId: nextSelectedId });
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

        <div className="grid grid-cols-1 gap-4">
          {items.map((card) => {
            const active = card.id === selectedId;
            return (
              <div className={`rounded-xl border p-5 ${active ? 'border-primary bg-primary/5' : 'border-outline-variant/25 bg-surface-container-lowest'}`} key={card.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-on-surface">{card.brand} •••• {card.last4}</p>
                    <p className="mt-1 text-sm text-on-surface-variant">{card.holderName} • Expires {card.expiry}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-md border border-outline-variant/25 px-3 py-1.5 text-xs font-semibold text-on-surface" onClick={() => startEdit(card)} type="button">
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
              <input className="rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-sm text-on-surface" placeholder="Card holder name" value={form.holderName} onChange={(e) => setForm((prev) => ({ ...prev, holderName: e.target.value }))} />
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