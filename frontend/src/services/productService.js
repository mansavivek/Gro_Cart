import api from './api';

let categoryIdByName = new Map();

// toNumberOrFallback
// Safely convert values to numbers with a fallback for malformed data.
function toNumberOrFallback(value, fallback = 0) {
	const n = Number(value);
	return Number.isFinite(n) ? n : fallback;
}

// normalizeImageUrls
// Normalizes various shapes where images may be provided by the backend.
function normalizeImageUrls(raw) {
	if (Array.isArray(raw?.image_urls)) return raw.image_urls.filter(Boolean);
	if (Array.isArray(raw?.images)) return raw.images.filter(Boolean);

	if (typeof raw?.images === 'string') {
		try {
			const parsed = JSON.parse(raw.images);
			if (Array.isArray(parsed)) return parsed.filter(Boolean);
		} catch {
			// ignore malformed image payloads
		}
	}

	return raw?.image_url ? [raw.image_url] : [];
}

// normalizeCategoryName
// Extracts category information from multiple possible backend fields.
function normalizeCategoryName(raw) {
	if (raw?.category?.name) return raw.category.name;
	if (raw?.category_name) return raw.category_name;
	if (raw?.breadcrumbs) return String(raw.breadcrumbs).split('>')[0].trim();
	return null;
}

// normalizeStock
// Produces a consistent `in_stock`, `quantity` and `availability`
// for components to rely on regardless of backend shape.
function normalizeStock(raw) {
	if (typeof raw?.in_stock === 'boolean') {
		const qty = raw?.quantity == null ? (raw.in_stock ? 25 : 0) : toNumberOrFallback(raw.quantity, raw.in_stock ? 25 : 0);
		return {
			in_stock: raw.in_stock,
			quantity: Math.max(0, qty),
			availability: raw.in_stock ? 'InStock' : 'OutOfStock',
		};
	}

	const normalizedAvailability = String(raw?.availability || '').toLowerCase();
	const availabilityInStock = normalizedAvailability === 'instock' || normalizedAvailability === 'in stock';
	const quantity = raw?.quantity == null ? (availabilityInStock ? 25 : 0) : toNumberOrFallback(raw.quantity, availabilityInStock ? 25 : 0);
	const inStock = quantity > 0;

	return {
		in_stock: inStock,
		quantity: Math.max(0, quantity),
		availability: inStock ? 'InStock' : 'OutOfStock',
	};
}

// normalizeProduct
// Convert a potentially inconsistent backend product object into a
// stable shape used by components across the app.
function normalizeProduct(raw = {}) {
	const categoryName = normalizeCategoryName(raw);
	const categoryId = raw.category_id ?? (categoryName ? categoryIdByName.get(categoryName) ?? null : null);
	const images = normalizeImageUrls(raw);
	const stock = normalizeStock(raw);

	return {
		...raw,
		id: raw.id ?? raw.sku,
		sku: raw.sku ?? raw.id,
		gtin13: raw.gtin13 ?? null,
		dataset_url: raw.dataset_url ?? raw.url ?? null,
		category_id: categoryId,
		category: raw.category || (categoryName ? { id: categoryId, name: categoryName } : null),
		price: toNumberOrFallback(raw.price),
		image_url: raw.image_url || images[0] || null,
		image_urls: images,
		avg_rating: toNumberOrFallback(raw.avg_rating),
		reviews_count: toNumberOrFallback(raw.reviews_count),
		pack_size: raw.pack_size ?? null,
		ingredients: raw.ingredients ?? null,
		storage_details: raw.storage_details ?? null,
		product_origin: raw.product_origin ?? null,
		serving_size: raw.serving_size ?? null,
		nutrition: raw.nutrition ?? null,
		...stock,
	};
}

export const getProducts = async (params) => {
	const response = await api.get('/products', { params });
	const list = Array.isArray(response.data) ? response.data : [];
	return { ...response, data: list.map(normalizeProduct) };
};

export const getProduct = async (id) => {
	const response = await api.get(`/products/${id}`);
	return { ...response, data: normalizeProduct(response.data || {}) };
};

export const getCategories = async () => {
	const response = await api.get('/categories');
	const list = Array.isArray(response.data) ? response.data : [];
	const normalized = list.map((category, idx) => ({
		id: category.id ?? idx + 1,
		name: category.name ?? 'Uncategorized',
	}));

	categoryIdByName = new Map(normalized.map((category) => [category.name, category.id]));

	return { ...response, data: normalized };
};

// Admin helpers
export const createProduct = (data) => api.post('/admin/products', data);
export const updateProduct = (id, data) => api.put(`/admin/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);
