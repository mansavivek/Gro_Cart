import api from './api';

export const fetchAddresses = () => api.get('/addresses');
export const addAddress = (data) => api.post('/addresses/add', data);
export const updateAddress = (addressId, data) => api.put(`/addresses/${addressId}`, data);
export const deleteAddressById = (addressId) => api.delete(`/addresses/${addressId}`);
export const setDefaultAddress = (addressId) => api.put(`/addresses/default/${addressId}`);