import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import grocartLogo from '../assets/grocart-logo1.png';
import {
  requestPasswordReset,
  verifyPasswordResetOtp,
  resetPassword,
} from '../services/authService';

function maskEmail(email) {
  const [name, domain] = email.split('@');
  if (!name || !domain) return '';
  const visible = name.slice(0, 1);
  return `Code sent to ${visible}${'*'.repeat(Math.max(1, name.length - 1))}@${domain}`;
}

function isStrongPassword(value) {
  return value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('forgot');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState(false);
  const [resendMessage, setResendMessage] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const strength = useMemo(() => {
    if (!newPassword) {
      return {
        text: 'Use at least 8 characters with letters and numbers.',
        cls: 'text-xs text-on-surface-variant',
      };
    }
    if (isStrongPassword(newPassword)) {
      return {
        text: 'Strong password.',
        cls: 'text-xs text-green-700',
      };
    }
    return {
      text: 'Password should be at least 8 characters and include letters and numbers.',
      cls: 'text-xs text-amber-700',
    };
  }, [newPassword]);

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    setEmailError(!valid);
    if (!valid) return;

    setSubmitting(true);
    setApiError('');
    try {
      await requestPasswordReset({ email: email.trim() });
      setResendMessage(false);
      setOtp(['', '', '', '', '', '']);
      setStep('otp');
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Unable to send OTP right now.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateOtp = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(0, 1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleOtpInput = (index, value) => {
    updateOtp(index, value);
    const nextValue = value.replace(/\D/g, '').slice(0, 1);
    if (nextValue && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    if (!pasted.length) return;

    const nextOtp = ['','','','','',''];
    pasted.split('').forEach((digit, idx) => {
      nextOtp[idx] = digit;
    });
    setOtp(nextOtp);
    const focusIndex = Math.min(pasted.length - 1, 5);
    document.getElementById(`otp-${focusIndex}`)?.focus();
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    const valid = code.length === 6;
    setOtpError(!valid);
    if (!valid) return;

    setSubmitting(true);
    setApiError('');
    try {
      await verifyPasswordResetOtp({ email: email.trim(), otp: code });
      setStep('reset');
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Invalid OTP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const valid = isStrongPassword(newPassword) && newPassword === confirmPassword;
    setPasswordError(!valid);
    if (!valid) return;

    setSubmitting(true);
    setApiError('');
    try {
      await resetPassword({ email: email.trim(), otp: otp.join(''), new_password: newPassword });
      setSuccessMessage(true);
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Could not update password. Please try again.');
      setSuccessMessage(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="font-body text-[#0b361d] min-h-screen flex flex-col bg-white"
      style={{
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuDeX4zOPo9TX3mkIqXejygJX8y9j01whBwv0ZKx080l-wfAJttySxhoIoNkAKEQS7lYt9gZkH3fcWUc-OTSSyc5WSWss1pXtjWpBi22Lkf5_syDMf1g_-Dm3sIoZ-hgsVs3_K32J6NUT11S3_WoqLe3O5ahFXC65EgH2rwf8mZNnqgDHB4lc7G0JKAYMdOw7M_F36tHRTDgGygRlz6ZWhC1gOlaiLstaG3z05Dxt3JlKDWNzagnylvAcIdG16Cp0TnbaR6j-P8UXKE)",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <main className="flex-grow flex items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-10">
            <img alt="Gro-Cart Logo" className="h-36 sm:h-40 w-auto object-contain" src={grocartLogo} />
          </div>

          {step === 'forgot' ? (
            <div className="w-full">
              <div className="text-center mb-8">
                <h1 className="font-headline text-3xl font-extrabold tracking-tight text-[#0b361d] mb-3">Forgot Password?</h1>
                <p className="text-[#3b6447] text-base leading-relaxed max-w-[340px] mx-auto">
                  No worries! Enter your email and we&apos;ll send you a verification code to reset your password.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleForgotSubmit}>
                <div className="space-y-2">
                  <label className="block font-headline font-semibold text-sm text-[#3b6447] px-1" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">mail</span>
                    </div>
                    <input
                      className="block w-full pl-11 pr-4 py-4 bg-surface-container-lowest border-0 rounded-xl ring-1 ring-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-outline-variant text-on-surface font-medium"
                      id="email"
                      name="email"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="buddy@gmail.com"
                      required
                      type="email"
                      value={email}
                    />
                  </div>
                  {emailError ? <p className="text-sm text-red-600 px-1">Please enter a valid email address.</p> : null}
                  {apiError ? <p className="text-sm text-red-600 px-1">{apiError}</p> : null}
                </div>

                <button className="w-full py-4 px-6 bg-primary text-on-primary font-headline font-bold text-lg rounded-xl shadow-soft hover:bg-primary-dim active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-60" disabled={submitting} type="submit">
                  {submitting ? 'Sending...' : 'Send Reset Link'}
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                </button>
              </form>

              <div className="mt-12 text-center">
                <Link className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dim transition-colors group" to="/login">
                  <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">chevron_left</span>
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : null}

          {step === 'otp' ? (
            <div className="w-full">
              <div className="text-center mb-8">
                <h1 className="font-headline text-3xl font-extrabold tracking-tight text-[#0b361d] mb-3">Verify OTP</h1>
                <p className="text-[#3b6447] text-base leading-relaxed max-w-[340px] mx-auto mb-2">
                  Enter the 6-digit code sent to your email to continue.
                </p>
                <p className="text-sm font-semibold text-primary">{maskEmail(email.trim())}</p>
              </div>

              <form className="space-y-6" onSubmit={handleOtpSubmit}>
                <div>
                  <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {otp.map((digit, index) => (
                      <input
                        className="h-14 w-12 sm:w-14 rounded-xl text-center text-xl font-bold bg-surface-container-lowest ring-1 ring-outline-variant/30 focus:ring-2 focus:ring-primary border-0"
                        id={`otp-${index}`}
                        inputMode="numeric"
                        key={index}
                        maxLength={1}
                        onChange={(e) => handleOtpInput(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        value={digit}
                      />
                    ))}
                  </div>
                  {otpError ? <p className="text-sm text-red-600 text-center mt-3">Enter the complete 6-digit OTP.</p> : null}
                  {apiError ? <p className="text-sm text-red-600 text-center mt-3">{apiError}</p> : null}
                </div>

                <button className="w-full py-4 px-6 bg-primary text-on-primary font-headline font-bold text-lg rounded-xl shadow-soft hover:bg-primary-dim active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-60" disabled={submitting} type="submit">
                  {submitting ? 'Verifying...' : 'Verify Code'}
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">check_circle</span>
                </button>
              </form>

              <div className="text-center mt-6">
                <p className="text-sm text-on-surface-variant font-medium">
                  Didn&apos;t receive the code?
                  <button className="text-primary font-bold hover:underline ml-1" onClick={() => setResendMessage(true)} type="button">Resend Code</button>
                </p>
                {resendMessage ? <p className="text-sm text-green-700 mt-2">A new code has been sent.</p> : null}
              </div>

              <div className="mt-12 text-center">
                <button className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dim transition-colors group" onClick={() => setStep('forgot')} type="button">
                  <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">chevron_left</span>
                  Back
                </button>
              </div>
            </div>
          ) : null}

          {step === 'reset' ? (
            <div className="w-full">
                <div className="bg-white p-8 rounded-xl shadow-soft border border-[#8bb795]/10">
                <div className="mb-8">
                  <h2 className="font-headline text-2xl font-bold text-[#0b361d] mb-2">Set New Password</h2>
                  <p className="text-[#3b6447] text-sm">Create a strong password that you don&apos;t use elsewhere.</p>
                </div>

                <form className="space-y-6" onSubmit={handleResetSubmit}>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-on-surface-variant" htmlFor="new-password">New Password</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
                      <input
                        className="w-full pl-10 pr-12 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface outline-none"
                        id="new-password"
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary" onClick={() => setShowNewPassword((prev) => !prev)} type="button">
                        <span className="material-symbols-outlined">{showNewPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                    <p className={strength.cls}>{strength.text}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-on-surface-variant" htmlFor="confirm-password">Confirm Password</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">lock_reset</span>
                      <input
                        className="w-full pl-10 pr-12 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface outline-none"
                        id="confirm-password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary" onClick={() => setShowConfirmPassword((prev) => !prev)} type="button">
                        <span className="material-symbols-outlined">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>

                  {passwordError ? <p className="text-sm text-red-600">Passwords must match and be at least 8 characters long.</p> : null}
                  {apiError ? <p className="text-sm text-red-600">{apiError}</p> : null}
                  {successMessage ? <p className="text-sm text-green-700 font-semibold">Password reset successfully.</p> : null}

                  <button className="w-full bg-primary hover:bg-primary-dim text-white font-bold py-3 px-6 rounded-lg transition-all active:scale-[0.98] shadow-soft disabled:opacity-60" disabled={submitting} type="submit">
                    {submitting ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>

              <div className="mt-8 text-center">
                <button className="inline-flex items-center text-on-surface-variant hover:text-primary transition-colors font-medium mr-4" onClick={() => setStep('otp')} type="button">
                  <span className="material-symbols-outlined mr-2 text-sm">arrow_back</span>
                  Back
                </button>
                <Link className="inline-flex items-center text-on-surface-variant hover:text-primary transition-colors font-medium mt-3 sm:mt-0" to="/login">
                  <span className="material-symbols-outlined mr-2 text-sm">login</span>
                  Back to Login
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      
      <footer className="bg-surface-container-low border-t py-8 text-center text-sm text-on-surface-variant">
        © {new Date().getFullYear()} Gro-Cart. All rights reserved.
      </footer>
    </div>
  );
}