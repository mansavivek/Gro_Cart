import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { initMockMode } from './services/mockData';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AddressesPage from './pages/AddressesPage';
import PaymentMethodsPage from './pages/PaymentMethodsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  useEffect(() => {
    // Initialize mock mode if enabled
    // initMockMode();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />

            {/* Protected – customers */}
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
            <Route path="/addresses" element={<ProtectedRoute><AddressesPage /></ProtectedRoute>} />
            <Route path="/payment-methods" element={<ProtectedRoute><PaymentMethodsPage /></ProtectedRoute>} />

            {/* Protected – admin */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
