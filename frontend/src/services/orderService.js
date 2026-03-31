import api from './api';

export const placeOrder = (data) => api.post('/orders/place', data);
export const getOrderHistory = () => api.get('/orders/history');

// Admin
export const getAllOrders = () => api.get('/admin/orders');
export const updateOrderStatus = (orderId, data) => api.put(`/admin/orders/${orderId}/status`, data);
