import axios from 'axios';
import { isMockModeEnabled, mockDataService } from './mockData';

const api = axios.create({
  baseURL: '/', // if running BE from another machine, change api address here and use this
  // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000', // if running both UI BE on same machine, use this
  headers: { 'Content-Type': 'application/json' },
});

function parseUserFromStorage() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function parseBody(data) {
  if (!data) return {};
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return data;
}

function getPathFromConfig(url = '', baseURL = '') {
  if (!url) return '';
  if (url.startsWith('/')) {
    return url.split('?')[0];
  }
  try {
    const parsed = new URL(url, baseURL || window.location.origin);
    return parsed.pathname;
  } catch {
    return url.split('?')[0];
  }
}

function getMockHandler({ method, path, data, params }) {
  const userId = parseUserFromStorage()?.id || 1;

  if (path === '/auth/login' && method === 'post') return () => mockDataService.login(data);
  if (path === '/auth/register' && method === 'post') return () => mockDataService.register(data);
  if (path === '/auth/forgot-password' && method === 'post') return () => mockDataService.requestPasswordReset(data);
  if (path === '/auth/verify-otp' && method === 'post') return () => mockDataService.verifyPasswordResetOtp(data);
  if (path === '/auth/reset-password' && method === 'post') return () => mockDataService.resetPassword(data);
  if (path === '/products' && method === 'get') return () => mockDataService.getProducts(params);
  if (path.match(/^\/products\/\d+$/) && method === 'get') {
    const id = path.split('/').pop();
    return () => mockDataService.getProduct(id);
  }
  if ((path === '/categories' || path === '/products/categories') && method === 'get') {
    return () => mockDataService.getCategories();
  }
  if (path === '/cart' && method === 'get') return () => mockDataService.getCart(userId);
  if (path === '/cart/add' && method === 'post') return () => mockDataService.addToCart(userId, data);
  if (path.match(/^\/cart\/update\/\d+$/) && method === 'put') {
    const id = Number(path.split('/').pop());
    return () => mockDataService.updateCartItem(userId, id, data);
  }
  if (path.match(/^\/cart\/remove\/\d+$/) && method === 'delete') {
    const id = Number(path.split('/').pop());
    return () => mockDataService.removeCartItem(userId, id);
  }
  if (path === '/cart/clear' && method === 'delete') {
    return () => mockDataService.clearCart(userId);
  }
  if (path === '/orders/history' && method === 'get') return () => mockDataService.getOrderHistory(userId);
  if (path === '/orders/place' && method === 'post') return () => mockDataService.placeOrder(userId, data);
  if (path === '/admin/orders' && method === 'get') return () => mockDataService.getAllOrders();
  if (path.match(/^\/admin\/orders\/\d+\/status$/) && method === 'put') {
    const id = path.split('/')[3];
    return () => mockDataService.updateOrderStatus(id, data);
  }
  if (path === '/admin/products' && method === 'post') return () => mockDataService.createProduct(data);
  if (path.match(/^\/admin\/products\/\d+$/) && method === 'put') {
    const id = path.split('/').pop();
    return () => mockDataService.updateProduct(id, data);
  }
  if (path.match(/^\/admin\/products\/\d+$/) && method === 'delete') {
    const id = path.split('/').pop();
    return () => mockDataService.deleteProduct(id);
  }

  return null;
}

function createMockAdapter(handler) {
  return async (config) => {
    try {
      const response = await handler();
      return {
        data: response?.data,
        status: response?.status || 200,
        statusText: response?.statusText || 'OK',
        headers: response?.headers || {},
        config,
        request: { mocked: true },
      };
    } catch (err) {
      const status = err?.response?.status || 500;
      return Promise.reject({
        ...err,
        config,
        response: {
          data: err?.response?.data || { detail: 'Mock request failed' },
          status,
          statusText: err?.response?.statusText || 'Error',
          headers: err?.response?.headers || {},
          config,
          request: { mocked: true },
        },
      });
    }
  };
}

// Mock mode interceptor - intercept requests when mock mode is enabled
api.interceptors.request.use(
  (config) => {
    const path = getPathFromConfig(config.url, config.baseURL);
    const isAuthRequest = path.startsWith('/auth/');
    const loggedInUser = parseUserFromStorage();
    config.headers = config.headers || {};

    if (!isAuthRequest && loggedInUser?.email && loggedInUser?.name) {
      config.headers['X-User-Email'] = loggedInUser.email;
      config.headers['X-User-Name'] = loggedInUser.name;
    } else {
      delete config.headers['X-User-Email'];
      delete config.headers['X-User-Name'];
    }

    if (isMockModeEnabled()) {
      const method = (config.method || 'get').toLowerCase();
      const data = parseBody(config.data);
      const mockHandler = getMockHandler({ method, path, data, params: config.params });

      if (mockHandler) {
        config.adapter = createMockAdapter(mockHandler);
      }
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor – handle 401 globally and mock mode
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const failedPath = getPathFromConfig(error.config?.url, error.config?.baseURL);
    const isAuthPageRequest = failedPath === '/auth/login' || failedPath === '/auth/register';

    if (error.response?.status === 401 && !isAuthPageRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const loginPath = `${import.meta.env.BASE_URL}login`;
      window.location.assign(loginPath);
    }
    return Promise.reject(error);
  },
);

export default api;
