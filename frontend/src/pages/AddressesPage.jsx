import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import {
  addAddress,
  deleteAddressById,
  fetchAddresses,
  setDefaultAddress,
  updateAddress,
} from '../services/addressService';

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

/**
 * AddressesPage
 *
 * Manage delivery addresses: list, add, edit, delete and set default.
 * The page coordinates with `CheckoutModal` through `location.state`
 * to optionally re-open checkout after selecting an address.
 */
export default function AddressesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const pageBackgroundStyle = {
    backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuDeX4zOPo9TX3mkIqXejygJX8y9j01whBwv0ZKx080l-wfAJttySxhoIoNkAKEQS7lYt9gZkH3fcWUc-OTSSyc5WSWss1pXtjWpBi22Lkf5_syDMf1g_-Dm3sIoZ-hgsVs3_K32J6NUT11S3_WoqLe3O5ahFXC65EgH2rwf8mZNnqgDHB4lc7G0JKAYMdOw7M_F36tHRTDgGygRlz6ZWhC1gOlaiLstaG3z05Dxt3JlKDWNzagnylvAcIdG16Cp0TnbaR6j-P8UXKE)",
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setError('');
      const { data } = await fetchAddresses();
      const list = Array.isArray(data) ? data : [];
      setItems(list);
      const active = list.find((item) => item.is_default) || list[0] || null;
      setSelectedId(active?.id || null);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load addresses.');
    }
  };

  // Helper to format address fields into a single readable line.
  const formatAddress = (address) => {
    return [
      address.address_line1,
      address.address_line2,
      [address.city, address.state].filter(Boolean).join(', '),
      address.zip,
      address.phone,
    ]
      .filter(Boolean)
      .join(', ');
  };

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const startEdit = (address) => {
    setEditingId(address.id);
    setForm({
      label: address.label || '',
      recipient: address.full_name || '',
      line1: address.address_line1 || '',
      line2: address.address_line2 || '',
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

  const saveForm = async () => {
    if (!form.label.trim() || !form.line1.trim()) return;

    const payload = {
      label: form.label,
      full_name: form.recipient,
      address_line1: form.line1,
      address_line2: form.line2,
      city: form.city,
      state: form.state,
      zip: form.zip,
      phone: form.phone,
    };

    try {
      setError('');
      if (editingId === 'new') {
        await addAddress(payload);
      } else {
        await updateAddress(editingId, payload);
      }
      setEditingId(null);
      setForm(EMPTY_FORM);
      await loadAddresses();
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to save address.');
    }
  };

  const selectAddress = async (id) => {
    try {
      setError('');
      await setDefaultAddress(id);
      await loadAddresses();
      if (location.state?.openCheckoutModal) {
        navigate(location.state?.returnTo || '/cart', { state: { openCheckoutModal: true } });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to set default address.');
    }
  };

  const deleteAddress = async (id) => {
    try {
      setError('');
      await deleteAddressById(id);
      await loadAddresses();
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to delete address.');
    }
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

        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4">
          {items.map((address) => {
            const active = address.id === selectedId;
            return (
              <div className={`rounded-xl border p-5 ${active ? 'border-primary bg-primary/5' : 'border-outline-variant/25 bg-surface-container-lowest'}`} key={address.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-on-surface">{address.label} - {address.full_name}</p>
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