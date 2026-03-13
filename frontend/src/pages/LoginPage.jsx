import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form.email, form.password);
      navigate(user.is_admin ? '/admin' : '/');
    } catch {
      // error shown via context
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto mt-8">
        <Card className="p-8">
          <div className="text-center mb-6">
            <span className="text-4xl">🛒</span>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your Gro-Cart account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-green-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </MainLayout>
  );
}
