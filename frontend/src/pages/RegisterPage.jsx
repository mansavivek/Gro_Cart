import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function RegisterPage() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone_number: '', address: '', date_of_birth: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/login');
    } catch {
      // error shown via context
    }
  };

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto mt-8">
        <Card className="p-8">
          <div className="text-center mb-6">
            <span className="text-4xl">🛒</span>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join Gro-Cart today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
            <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} required />
            <Input label="Phone Number" name="phone_number" value={form.phone_number} onChange={handleChange} />
            <Input label="Address" name="address" value={form.address} onChange={handleChange} />
            <Input label="Date of Birth" type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </MainLayout>
  );
}
