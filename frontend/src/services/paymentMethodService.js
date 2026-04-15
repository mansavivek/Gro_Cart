import api from './api';

export const fetchPaymentMethods = () => api.get('/payments');
export const addPaymentMethod = (data) => api.post('/payments/add', data);