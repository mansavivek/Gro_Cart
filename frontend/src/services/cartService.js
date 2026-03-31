import api from './api';

export const getCart = () => api.get('/cart');
export const addToCart = (data) => api.post('/cart/add', data);
export const updateCartItem = (itemId, data) => api.put(`/cart/update/${itemId}`, data);
export const removeCartItem = (itemId) => api.delete(`/cart/remove/${itemId}`);
export const clearCart = () => api.delete('/cart/clear');
