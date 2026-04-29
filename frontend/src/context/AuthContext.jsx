import { createContext, useContext, useState } from 'react';
import { login as loginApi, register as registerApi } from '../services/authService';

const AuthContext = createContext(null);

// normalizeUser
// Ensures the shape of the user object includes a boolean `is_admin` flag
// (some backends return `role` while others supply `is_admin`).
function normalizeUser(user) {
  if (!user) return null;
  const isAdmin = Boolean(user.is_admin) || user.role === 'admin';
  return {
    ...user,
    is_admin: isAdmin,
  };
}

export function AuthProvider({ children }) {
  // Initialize `user` from localStorage when present.
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? normalizeUser(JSON.parse(stored)) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [registerError, setRegisterError] = useState(null);

  // login
  // Calls the `loginApi`, persists token/user to localStorage and
  // returns the normalized user object.
  const login = async (email, password) => {
    setLoading(true);
    setLoginError(null);
    try {
      const { data } = await loginApi({ email, password });
      if (!data?.token || !data?.user) {
        throw new Error('Invalid login response');
      }
      const normalizedUser = normalizeUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      return normalizedUser;
    } catch (err) {
      setLoginError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.message ||
        'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // register
  // Wrapper around the registration API that surfaces server-side
  // validation messages via `registerError` state.
  const register = async (userData) => {
    setLoading(true);
    setRegisterError(null);
    try {
      const resp = await registerApi(userData);
      const { data } = resp;
      if (data?.error) {
        setRegisterError(data.error);
        throw new Error(data.error);
      }
      return data;
    } catch (err) {
      setRegisterError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.message ||
        'Registration failed'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // logout
  // Clear persisted auth info and reset local error state.
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setLoginError(null);
    setRegisterError(null);
  };

  const clearLoginError = () => setLoginError(null);
  const clearRegisterError = () => setRegisterError(null);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginError,
      registerError,
      login,
      register,
      logout,
      clearLoginError,
      clearRegisterError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
