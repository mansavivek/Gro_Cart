import api from './api';

// placeOrder
// Submit a new order to the backend.
export const placeOrder = (data) => api.post('/orders/place', data);

// joinAddressParts
// Utility to safely join address parts into a readable string.
function joinAddressParts(parts) {
	return parts
		.map((part) => String(part || '').trim())
		.filter(Boolean)
		.join(', ');
}

// buildDeliveryAddress
// Construct a delivery address string from various possible fields
// present on an order/address object.
function buildDeliveryAddress(order = {}) {
	if (order.delivery_address) return order.delivery_address;

	const street = joinAddressParts([order.address_line1, order.address_line2]);
	const locality = joinAddressParts([order.city, order.state, order.zip]);
	const recipient = String(order.full_name || '').trim();
	const phone = String(order.phone || '').trim();

	return joinAddressParts([recipient, street, locality, phone]);
}

// normalizeOrderHistoryOrder
// Ensures stable fields for order history including `total_amount` and
// a formatted `delivery_address` for display.
function normalizeOrderHistoryOrder(rawOrder = {}) {
	const total = Number(rawOrder.total_amount ?? rawOrder.total_price ?? 0);
	return {
		...rawOrder,
		status: normalizeOrderStatus(rawOrder.status),
		total_amount: total,
		total_price: total,
		delivery_address: buildDeliveryAddress(rawOrder),
	};
}

export const getOrderHistory = async () => {
	const response = await api.get('/orders/history');
	const raw = response.data;
	const list = Array.isArray(raw) ? raw : (Array.isArray(raw?.orders) ? raw.orders : []);
	return { ...response, data: list.map(normalizeOrderHistoryOrder) };
};

const ACTIVE_ADMIN_STATUSES = new Set(['placed', 'pending', 'in_progress', 'packed', 'out_for_delivery']);

// normalizeOrderStatus
// Canonicalize status strings to a smaller set used by the admin UI.
function normalizeOrderStatus(status) {
	const normalized = String(status || 'pending').toLowerCase();
	if (normalized === 'processing') return 'in_progress';
	return normalized;
}

// normalizeAdminOrder
// Normalize the admin-facing order shape, providing defaults for
// missing fields and ensuring counts and totals are numbers.
function normalizeAdminOrder(rawOrder = {}) {
	const total = Number(rawOrder.total_amount ?? rawOrder.total_price ?? 0);
	const items = Array.isArray(rawOrder.items) ? rawOrder.items : [];

	return {
		id: rawOrder.id ?? rawOrder.order_id ?? 0,
		user: {
			id: rawOrder.user?.id ?? rawOrder.user_id ?? null,
			name: rawOrder.user?.name ?? rawOrder.customer_name ?? 'Customer',
			email: rawOrder.user?.email ?? rawOrder.customer_email ?? null,
		},
		status: normalizeOrderStatus(rawOrder.status),
		created_at: rawOrder.created_at || rawOrder.createdAt || new Date().toISOString(),
		total_amount: total,
		total_price: total,
		items,
		items_count: rawOrder.items_count ?? items.length,
		delivery_address: rawOrder.delivery_address || null,
	};
}

// Admin response shape:
// {
//   orders: NormalizedAdminOrder[],
//   meta: { total_orders: number, total_revenue: number, active_orders: number }
// }
export const getAdminOrders = async () => {
	const { data } = await api.get('/admin/orders');
	const rawOrders = Array.isArray(data) ? data : (Array.isArray(data?.orders) ? data.orders : []);
	const orders = rawOrders.map(normalizeAdminOrder);
	const totalRevenue = Number(orders.reduce((sum, order) => sum + (order.total_amount || 0), 0).toFixed(2));

	return {
		orders,
		meta: {
			total_orders: orders.length,
			total_revenue: totalRevenue,
			active_orders: orders.filter((order) => ACTIVE_ADMIN_STATUSES.has(order.status)).length,
		},
	};
};

export const updateOrderStatus = async (orderId, data) => {
	const response = await api.put(`/admin/orders/${orderId}/status`, data);
	return normalizeAdminOrder(response.data);
};
