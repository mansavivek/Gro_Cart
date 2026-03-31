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
    expect(screen.getByText(/farm fresh, always ready/i)).toBeInTheDocument();
  });

  it('renders category sidebar with All Products button', async () => {
    renderHome();
    const allProductsBtn = await screen.findByRole('button', { name: /all products/i });
    expect(allProductsBtn).toBeInTheDocument();
  });
});


