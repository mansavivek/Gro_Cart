import api from './api';

// Cart API helpers used by CartContext. They return the axios promise
// directly so the calling code can inspect responses or await them.
export const getCart = () => api.get('/cart');
export const addToCart = (data) => api.post('/cart/add', data);
export const updateCartItem = (itemId, data) => api.put(`/cart/update/${itemId}`, data);
export const removeCartItem = (itemId) => api.delete(`/cart/remove/${itemId}`);
export const clearCart = () => api.delete('/cart/clear');
