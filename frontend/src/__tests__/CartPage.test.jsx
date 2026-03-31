import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('../services/cartService', () => ({
  getCart: vi.fn().mockResolvedValue({ data: { items: [], total_items: 0, total_price: 0 } }),
}));

import CartPage from '../pages/CartPage';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

function renderCart() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <CartPage />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('CartPage', () => {
  it('shows empty cart message when cart is empty', async () => {
    renderCart();
    // spinner or empty message
    await screen.findByText(/your cart is empty/i);
  });
});
