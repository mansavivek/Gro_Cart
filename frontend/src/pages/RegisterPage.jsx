import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import grocartLogo from '../assets/grocart-logo1.png';
import ErrorAlert from '../components/ui/ErrorAlert';

export default function RegisterPage() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });

  const getFriendlyRegisterError = (rawError) => {
    if (!rawError) return '';
    const normalized = String(rawError).toLowerCase();
    if (normalized.includes('already') || normalized.includes('exists')) {
      return 'An account with this email already exists. Please sign in or use another email.';
    }
    if (normalized.includes('network') || normalized.includes('failed to fetch')) {
      return 'We could not reach the server. Please check your internet connection and try again.';
    }
    return 'We could not create your account right now. Please try again in a moment.';
  };

  // Integration point: wire HTML inputs to local state.
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Integration point: submit HTML form -> existing AuthContext register API flow.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    if (!agreeToTerms) {
      setValidationError('Please agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setValidationError('Your passwords do not match. Please re-enter them and try again.');
      return;
    }
    try {
      const payload = { name: form.name, email: form.email, password: form.password };
      await register(payload);
      navigate('/login');
    } catch {
      // error shown via context
    }
  };

  return (
    <div className="bg-background-light text-slate-900 min-h-screen flex flex-col">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between px-6 lg:px-20 pt-2 pb-0" />
          <div className="flex flex-col items-center gap-3 mx-auto">
            <img alt="Gro-Cart Buddy Logo" className="w-auto object-contain mix-blend-multiply bg-background-light h-32" src={grocartLogo} />

            <main className="flex-1 flex justify-center items-start pb-12 px-6 pt-0">
              <div className="w-full max-w-[480px] flex flex-col gap-8">
                <div className="flex flex-col gap-2 text-center sm:text-left">
                  <h1 className="font-black leading-tight tracking-tight text-slate-900 text-3xl">Create Account</h1>
                  <p className="text-slate-600 font-normal text-sm">Join Gro-Cart for easy grocery shopping and fresh deliveries.</p>
                </div>

                <ErrorAlert
                  title="Please review your details"
                  message={validationError}
                />
                <ErrorAlert
                  title="Registration failed"
                  message={error ? getFriendlyRegisterError(error) : ''}
                />

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-900 font-semibold text-xs">Full Name</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                      <input
                        className="form-input flex w-full rounded-xl border border-slate-200 bg-white h-14 pl-12 pr-4 text-base focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-slate-400"
                        placeholder="Enter your full name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-900 font-semibold text-xs">Email Address</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                      <input
                        className="form-input flex w-full rounded-xl border border-slate-200 bg-white h-14 pl-12 pr-4 text-base focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-slate-400"
                        placeholder="buddy@gmail.com"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-900 font-semibold text-xs">Password</label>
                    <div className="relative flex">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                      <input
                        className="form-input flex w-full rounded-xl border border-slate-200 bg-white h-14 pl-12 pr-12 text-base focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-slate-400"
                        placeholder="Create a password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary" type="button" onClick={() => setShowPassword((prev) => !prev)}>
                        <span className="material-symbols-outlined text-xl" data-icon="visibility">
                          visibility
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-900 font-semibold text-xs">Confirm Password</label>
                    <div className="relative flex">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock_reset</span>
                      <input
                        className="form-input flex w-full rounded-xl border border-slate-200 bg-white h-14 pl-12 pr-4 text-base focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-slate-400"
                        placeholder="Repeat your password"
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-1">
                    <input className="rounded border-slate-300 text-primary focus:ring-primary" id="terms" type="checkbox" checked={agreeToTerms} onChange={(e) => setAgreeToTerms(e.target.checked)} />
                    <label className="text-slate-600 text-xs" htmlFor="terms">
                      I agree to the <a className="text-primary font-medium hover:underline" href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a> and <a className="text-primary font-medium hover:underline" href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                    </label>
                  </div>
                  <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-2 disabled:opacity-60" type="submit" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                </form>

                <div className="text-center pb-8">
                  <p className="text-slate-600 text-base">
                    Already have an account?
                    <Link className="text-primary font-bold hover:underline ml-1" to="/login"> Sign In</Link>
                  </p>
                </div>
              </div>
            </main>

            <footer className="mt-auto bg-surface-container-low border-t py-8 text-center text-sm text-on-surface-variant w-full">
              <p>© {new Date().getFullYear()} Gro-Cart. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
