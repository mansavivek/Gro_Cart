import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import grocartLogo from '../assets/grocart-logo1.png'; 

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });

  const getFriendlyLoginError = (rawError) => {
    if (!rawError) return '';
    const normalized = String(rawError).toLowerCase();
    if (normalized.includes('invalid') || normalized.includes('incorrect')) {
      return 'The email or password you entered is incorrect. Please try again.';
    }
    if (normalized.includes('network') || normalized.includes('failed to fetch')) {
      return 'We could not reach the server. Please check your internet connection and try again.';
    }
    return 'We could not sign you in right now. Please try again in a moment.';
  };

  // Integration point: bind HTML inputs to React state so form data is available to API logic.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  // Integration point: submit UI form -> existing AuthContext login API flow.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch {
      // error shown via context
    }
  };

  return (
    <>
      <div
        className="bg-gray-50 min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuDeX4zOPo9TX3mkIqXejygJX8y9j01whBwv0ZKx080l-wfAJttySxhoIoNkAKEQS7lYt9gZkH3fcWUc-OTSSyc5WSWss1pXtjWpBi22Lkf5_syDMf1g_-Dm3sIoZ-hgsVs3_K32J6NUT11S3_WoqLe3O5ahFXC65EgH2rwf8mZNnqgDHB4lc7G0JKAYMdOw7M_F36tHRTDgGygRlz6ZWhC1gOlaiLstaG3z05Dxt3JlKDWNzagnylvAcIdG16Cp0TnbaR6j-P8UXKE)",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <main className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <header className="pt-8 pb-6 px-8 text-center">
            <img
              alt="Gro-Cart Logo"
              className="mx-auto h-32 w-auto mb-2"
              style={{ height: '14rem' }}
              src={grocartLogo}
            />
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back!</h1>
            <p className="text-gray-500 mt-2">Log in to manage your grocery list</p>
          </header>

          <section className="px-8 pb-10">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
                <p className="font-semibold">Sign in failed</p>
                <p>{getFriendlyLoginError(error)}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                  Email Address
                </label>
                <input
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-gro-green focus:border-gro-green transition duration-150"
                  id="email"
                  name="email"
                  placeholder="buddy@gmail.com"
                  required
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                    Password
                  </label>
                  <Link
                    className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition duration-150"
                    to="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <input
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-gro-green focus:border-gro-green transition duration-150"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center">
                <input
                  className="h-4 w-4 text-gro-green focus:ring-gro-green border-gray-300 rounded"
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={handleChange}
                />
                <label className="ml-2 block text-sm text-gray-700" htmlFor="remember-me">
                  Remember me
                </label>
              </div>

              <button
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-gro-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gro-green transition duration-150 transform active:scale-95 disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              New to Gro-Cart?{' '}
              <Link className="font-semibold text-gro-orange hover:text-orange-600 transition duration-150" to="/register">
                Create an account
              </Link>
            </p>
          </section>
        </main>
      </div>

      <footer className="bg-surface-container-low border-t py-8 text-center text-sm text-on-surface-variant">
        © {new Date().getFullYear()} Gro-Cart. All rights reserved.
      </footer>
    </>
  );
}
