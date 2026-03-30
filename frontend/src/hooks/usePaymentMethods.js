import { useState } from 'react';

const STORAGE_KEY = 'grocart_payment_methods';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function usePaymentMethods() {
  const [methods, setMethods] = useState(load);

  const persist = (list) => {
    setMethods(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const addMethod = (m) =>
    persist([...methods, { ...m, id: crypto.randomUUID() }]);

  const updateMethod = (id, m) =>
    persist(methods.map((x) => (x.id === id ? { ...x, ...m } : x)));

  const deleteMethod = (id) =>
    persist(methods.filter((x) => x.id !== id));

  return { methods, addMethod, updateMethod, deleteMethod };
}
