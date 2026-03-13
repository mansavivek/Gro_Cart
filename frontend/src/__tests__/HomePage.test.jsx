import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('../services/productService', () => ({
  getProducts: vi.fn().mockResolvedValue({ data: [] }),
  getCategories: vi.fn().mockResolvedValue({ data: [] }),
}));

vi.mock('../services/cartService', () => ({
  getCart: vi.fn().mockResolvedValue({ data: { items: [], total_items: 0, total_price: 0 } }),
}));

import HomePage from '../pages/HomePage';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

function renderHome() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <HomePage />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('HomePage', () => {
  it('renders hero banner', async () => {
    renderHome();
    expect(screen.getByText(/fresh groceries delivered/i)).toBeInTheDocument();
  });

  it('renders All category button after categories load', async () => {
    renderHome();
    const allBtn = await screen.findByRole('button', { name: /^all$/i });
    expect(allBtn).toBeInTheDocument();
  });
});
