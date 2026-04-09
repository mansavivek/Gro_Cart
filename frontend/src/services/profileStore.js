function userKey(user) {
  return user?.email || user?.id || 'guest';
}

function storageKey(prefix, user) {
  return `${prefix}:${userKey(user)}`;
}

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getAddressBook(user) {
  const key = storageKey('grocart-addresses', user);
  const fallbackAddress = user?.address
    ? {
      id: 'addr-default',
      label: 'Home',
      recipient: user?.name || 'Customer',
      line1: user.address,
      line2: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
    }
    : null;

  const fallback = {
    items: fallbackAddress ? [fallbackAddress] : [],
    selectedId: fallbackAddress ? fallbackAddress.id : null,
  };

  const value = safeRead(key, fallback);
  if (!Array.isArray(value.items)) return fallback;
  return {
    items: value.items,
    selectedId: value.selectedId || value.items[0]?.id || null,
  };
}

export function saveAddressBook(user, data) {
  const key = storageKey('grocart-addresses', user);
  safeWrite(key, {
    items: data.items || [],
    selectedId: data.selectedId || data.items?.[0]?.id || null,
  });
}

export function getPaymentMethods(user) {
  const key = storageKey('grocart-payments', user);
  // const fallbackCard = {
  //   id: 'card-default',
  //   holderName: user?.name || 'Card Holder',
  //   brand: 'Visa',
  //   last4: '4242',
  //   expiry: '12/28',
  // };
  const fallback = {
    items: [],
    selectedId: null,
  };

  const value = safeRead(key, fallback);
  if (!Array.isArray(value.items) || value.items.length === 0) return fallback;
  return {
    items: value.items,
    selectedId: value.selectedId || value.items[0]?.id || null,
  };
}

export function savePaymentMethods(user, data) {
  const key = storageKey('grocart-payments', user);
  safeWrite(key, {
    items: data.items || [],
    selectedId: data.selectedId || data.items?.[0]?.id || null,
  });
}

export function formatAddress(address) {
  if (!address) return '';
  return [
    address.line1,
    address.line2,
    [address.city, address.state].filter(Boolean).join(', '),
    address.zip,
    address.phone,
  ]
    .filter(Boolean)
    .join(', ');
}