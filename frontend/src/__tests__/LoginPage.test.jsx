import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock auth service
vi.mock('../services/authService', () => ({
  login: vi.fn(),
  register: vi.fn(),
}));

vi.mock('../services/cartService', () => ({
  getCart: vi.fn().mockResolvedValue({ data: { items: [], total_items: 0, total_price: 0 } }),
}));

import LoginPage from '../pages/LoginPage';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import * as authService from '../services/authService';

function renderLogin() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <LoginPage />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  it('renders login form', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows error on failed login', async () => {
    authService.login.mockRejectedValue({
      response: { data: { detail: 'Invalid email or password' } },
    });

    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'bad@email.com', name: 'email' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'wrongpass', name: 'password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });
});
