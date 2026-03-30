import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAddresses } from '../hooks/useAddresses';

const emptyForm = { label: '', line1: '', line2: '', city: '', state: '', pincode: '' };

export default function AddressesPage() {
  const { addresses, addAddress, updateAddress, deleteAddress } = useAddresses();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const location = useLocation();
  const navigate = useNavigate();

  // selectMode: coming from checkout modal to pick an address
  const selectMode = location.state?.selectMode === true;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      updateAddress(editId, form);
    } else {
      addAddress(form);
    }
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (addr) => {
    setForm({
      label: addr.label || '',
      line1: addr.line1 || '',
      line2: addr.line2 || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
    });
    setEditId(addr.id);
    setShowForm(true);
  };

  const handleSelect = (addr) => {
    navigate('/cart', { state: { openCheckout: true, selectedAddress: addr } });
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
              {selectMode ? 'Select Delivery Address' : 'Saved Addresses'}
            </h1>
            {selectMode && (
              <p className="text-sm text-gray-500 mt-1">Choose an address for your order</p>
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
              {showForm ? 'Cancel' : '+ Add Address'}
            </Button>
          )}
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <Card className="p-5 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">
              {editId ? 'Edit Address' : 'New Address'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                label="Label (e.g. Home, Work)"
                name="label"
                value={form.label}
                onChange={handleChange}
                placeholder="Home"
              />
              <Input
                label="Address Line 1"
                name="line1"
                value={form.line1}
                onChange={handleChange}
                required
                placeholder="Street, Building"
              />
              <Input
                label="Address Line 2 (Optional)"
                name="line2"
                value={form.line2}
                onChange={handleChange}
                placeholder="Apartment, Suite"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="State"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                />
              </div>
              <Input
                label="Pincode"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                required
                placeholder="000000"
              />
              <div className="flex gap-2 pt-1">
                <Button type="submit">{editId ? 'Save Changes' : 'Add Address'}</Button>
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Address List */}
        {addresses.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">📍</p>
            <p className="font-medium text-gray-500">No saved addresses yet</p>
            <p className="text-sm mt-1">Add an address to get started</p>
            <Button
              className="mt-4"
              onClick={() => {
                setShowForm(true);
                setForm(emptyForm);
                setEditId(null);
              }}
            >
              + Add Address
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <Card key={addr.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">📍</span>
                    <div>
                      {addr.label && (
                        <span className="inline-block text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full mb-1">
                          {addr.label}
                        </span>
                      )}
                      <p className="text-sm font-medium text-gray-800">{addr.line1}</p>
                      {addr.line2 && <p className="text-sm text-gray-500">{addr.line2}</p>}
                      <p className="text-sm text-gray-500">
                        {[addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end shrink-0">
                    {selectMode ? (
                      <Button size="sm" onClick={() => handleSelect(addr)}>
                        Select
                      </Button>
                    ) : (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(addr)}>
                          Edit
                        </Button>
                        <button
                          onClick={() => deleteAddress(addr.id)}
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

        {/* Add address button at bottom in select mode */}
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
              + Add New Address
            </Button>
            {showForm && (
              <Card className="p-5 mt-4">
                <h2 className="font-semibold text-gray-700 mb-4">New Address</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <Input label="Label" name="label" value={form.label} onChange={handleChange} placeholder="Home" />
                  <Input label="Address Line 1" name="line1" value={form.line1} onChange={handleChange} required />
                  <Input label="Address Line 2 (Optional)" name="line2" value={form.line2} onChange={handleChange} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="City" name="city" value={form.city} onChange={handleChange} required />
                    <Input label="State" name="state" value={form.state} onChange={handleChange} required />
                  </div>
                  <Input label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} required />
                  <div className="flex gap-2 pt-1">
                    <Button type="submit">Add Address</Button>
                    <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
                  </div>
                </form>
              </Card>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
