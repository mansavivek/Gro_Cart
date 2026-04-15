import { createContext, useContext, useState } from 'react';
import { login as loginApi, register as registerApi } from '../services/authService';

const AuthContext = createContext(null);

function normalizeUser(user) {
  if (!user) return null;
  const isAdmin = Boolean(user.is_admin) || user.role === 'admin';
  return {
    ...user,
    is_admin: isAdmin,
  };
}

export function AuthProvider({ children }) {
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
