import api from './api';

// Thin wrappers around auth-related endpoints. Kept small so callers
// can `await` the axios promise and inspect `response.data` as needed.
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

export const requestPasswordReset = (data) => api.post('/auth/forgot-password', data);
export const verifyPasswordResetOtp = (data) => api.post('/auth/verify-otp', data);
export const resetPassword = (data) => api.post('/auth/reset-password', data);
