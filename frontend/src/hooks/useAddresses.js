import { useState } from 'react';

const STORAGE_KEY = 'grocart_addresses';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function useAddresses() {
  const [addresses, setAddresses] = useState(load);

  const persist = (list) => {
    setAddresses(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const addAddress = (addr) =>
    persist([...addresses, { ...addr, id: crypto.randomUUID() }]);

  const updateAddress = (id, addr) =>
    persist(addresses.map((a) => (a.id === id ? { ...a, ...addr } : a)));

  const deleteAddress = (id) =>
    persist(addresses.filter((a) => a.id !== id));

  return { addresses, addAddress, updateAddress, deleteAddress };
}
