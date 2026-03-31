import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { formatAddress, getAddressBook, saveAddressBook } from '../services/profileStore';

const EMPTY_FORM = {
  label: '',
  recipient: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
};

export default function AddressesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!user) return;
    const book = getAddressBook(user);
    setItems(book.items);
    setSelectedId(book.selectedId);
  }, [user]);

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const startEdit = (address) => {
    setEditingId(address.id);
    setForm({
      label: address.label || '',
      recipient: address.recipient || '',
      line1: address.line1 || '',
      line2: address.line2 || '',
      city: address.city || '',
      state: address.state || '',
      zip: address.zip || '',
      phone: address.phone || '',
    });
  };

  const startAdd = () => {
    setEditingId('new');
    setForm({ ...EMPTY_FORM, recipient: user?.name || '' });
  };

  const saveForm = () => {
    if (!form.label.trim() || !form.line1.trim()) return;

    const id = editingId === 'new' ? `addr-${Date.now()}` : editingId;
    const nextItems = editingId === 'new'
      ? [...items, { id, ...form }]
      : items.map((item) => (item.id === id ? { ...item, ...form } : item));

    const nextSelectedId = selectedId || id;
    setItems(nextItems);
    setSelectedId(nextSelectedId);
    saveAddressBook(user, { items: nextItems, selectedId: nextSelectedId });
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const selectAddress = (id) => {
    setSelectedId(id);
    saveAddressBook(user, { items, selectedId: id });
    if (location.state?.openCheckoutModal) {
      navigate(location.state?.returnTo || '/cart', { state: { openCheckoutModal: true } });
    }
  };

  const deleteAddress = (id) => {
    const nextItems = items.filter((item) => item.id !== id);
    const nextSelectedId = selectedId === id ? nextItems[0]?.id || null : selectedId;
    setItems(nextItems);
    setSelectedId(nextSelectedId);
    saveAddressBook(user, { items: nextItems, selectedId: nextSelectedId });
  };

  const goBack = () => {
    const target = location.state?.returnTo || '/cart';
    navigate(target, { state: { openCheckoutModal: Boolean(location.state?.openCheckoutModal) } });
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl px-2 py-2">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Profile</p>
            <h1 className="mt-1 text-4xl font-headline font-extrabold text-on-surface">Addresses</h1>
            <p className="mt-2 text-sm text-on-surface-variant">Manage your delivery addresses and choose a default.</p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-lg border border-outline-variant/30 px-4 py-2 text-sm font-semibold text-on-surface" onClick={goBack} type="button">
              Back
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary" onClick={startAdd} type="button">
              Add Address
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {items.map((address) => {
            const active = address.id === selectedId;
            return (
              <div className={`rounded-xl border p-5 ${active ? 'border-primary bg-primary/5' : 'border-outline-variant/25 bg-surface-container-lowest'}`} key={address.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-on-surface">{address.label} - {address.recipient}</p>
                    <p className="mt-1 text-sm text-on-surface-variant">{formatAddress(address)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-md border border-outline-variant/25 px-3 py-1.5 text-xs font-semibold text-on-surface" onClick={() => startEdit(address)} type="button">
                      Edit
                    </button>
                    <button
                      aria-label="Delete address"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => deleteAddress(address.id)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                    <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary" onClick={() => selectAddress(address.id)} type="button">
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
            <h2 className="text-xl font-headline font-extrabold text-on-surface mb-4">{editingId === 'new' ? 'Add Address' : 'Edit Address'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-sm text-on-surface" placeholder="Label (Home, Work...)" value={form.label} onChange={(e) => updateForm('label', e.target.value)} />
              <input className="rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-sm text-on-surface" placeholder="Recipient name" value={form.recipient} onChange={(e) => updateForm('recipient', e.target.value)} />
              <input className="md:col-span-2 rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-sm text-on-surface" placeholder="Address line 1" value={form.line1} onChange={(e) => updateForm('line1', e.target.value)} />
              <input className="md:col-span-2 rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-sm text-on-surface" placeholder="Address line 2 (optional)" value={form.line2} onChange={(e) => updateForm('line2', e.target.value)} />
              <input className="rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-sm text-on-surface" placeholder="City" value={form.city} onChange={(e) => updateForm('city', e.target.value)} />
              <input className="rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-sm text-on-surface" placeholder="State" value={form.state} onChange={(e) => updateForm('state', e.target.value)} />
              <input className="rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-sm text-on-surface" placeholder="Zip" value={form.zip} onChange={(e) => updateForm('zip', e.target.value)} />
              <input className="rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-sm text-on-surface" placeholder="Phone" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} />
            </div>
            <div className="mt-5 flex gap-2">
              <button className="rounded-lg border border-outline-variant/30 px-4 py-2 text-sm font-semibold text-on-surface" onClick={() => setEditingId(null)} type="button">
                Cancel
              </button>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary" onClick={saveForm} type="button">
                Save Address
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
}