/**
 * Mock Data Service
 * Provides realistic test data for end-to-end testing
 * Based on Tesco groceries dataset and design specifications
 */

const CATEGORY_ICON_MAP = {
  'Frozen Food': 'ac_unit',
  'Food Cupboard': 'kitchen',
  Drinks: 'local_bar',
  Baby: 'child_care',
  Bakery: 'bakery_dining',
  'Health & Beauty': 'spa',
  'Fresh Food': 'eco',
};

const DATASET_PRODUCTS = [
  {
    sku: 305829059,
    name: 'Birds Eye Crispy Pancakes Beef & Onion 4 Pack 266G',
    url: 'https://www.tesco.com/groceries/en-GB/products/305829059',
    gtin13: '05000116125234',
    price: 2.2,
    currency: 'GBP',
    availability: 'OutOfStock',
    description:
      'Pancakes coated in breadcrumbs with a minced beef and onion filling, lightly fried. For a sustainable tomorrow. Making a difference with responsibly sourced and prepared food everyday. birdseye.co.uk/our-sustainable-path. The new & tasty,Ready in 10 mins',
    brand: 'BIRDS EYE',
    breadcrumbs: 'Frozen Food~Frozen Ready Meals~Frozen Snacking',
    images:
      'https://digitalcontent.api.tesco.com/v2/media/ghs/3e55410b-419d-4b54-a446-a54282fd37ec/15b37da6-6399-4dd8-8a6d-ac1358fcc282.jpeg',
    avg_rating: 1.5,
    reviews_count: 23,
    pack_size: 'Pack size: 266G',
    serving_size: 'This pack contains 4 portions',
    product_origin: '',
    storage_details: 'Store in a freezer at -18C or cooler.',
    ingredients:
      'Filling (42%) (Water, Minced Beef (20%), Fried Onion (17%) (Onion, Rapeseed Oil), Beef Stock (Beef Stock, Sugar, Concentrated Carrot Juice, Onion Concentrate, Tomato Paste), Wheat Starch, Sunflower Oil, Onion, Tomato Puree, Carrot, Skimmed Milk Powder, Wheat Flour, Salt, Black Pepper, Rosemary Extract, Bay Leaf), Wheat Flour, Water, Sunflower Oil, Breadcrumbs (Wheat Flour, Salt, Yeast, Paprika Powder, Turmeric), Pasteurised Whole Egg, Skimmed Milk Powder, Wheat Starch, Salt, Concentrated Lemon Juice',
    nutrition:
      "[{'Energy - kJ': '1145kJ'}, {' - kcal': '274kcal'}, {'Fat ': '15g'}, {'- of which Saturates ': '2.0g'}, {'Carbohydrate ': '26g'}, {'- of which Sugars ': '3.0g'}, {'Fibre ': '1.1g'}, {'Protein ': '8.2g'}, {'Salt ': '0.72g'}]",
  },
  {
    sku: 257522449,
    name: 'Schwartz Fish Seasoning 55G',
    url: 'https://www.tesco.com/groceries/en-GB/products/257522449',
    gtin13: '00000050020881',
    price: 1.85,
    currency: 'GBP',
    availability: 'InStock',
    description: 'Schwartz Fish Seasoning 55G. For recipes and cooking suggestions visit: www.schwartz.co.uk',
    brand: 'SCHWARTZ',
    breadcrumbs: 'Food Cupboard~Cooking Ingredients~Seasoning, Herbs & Spices',
    images:
      'https://digitalcontent.api.tesco.com/v2/media/ghs/9c024dec-99a1-4dd0-aadb-f0d13b96c248/801f35a2-4b13-4e30-baf0-af589425c55a_1034377439.jpeg~https://digitalcontent.api.tesco.com/v2/media/ghs/0005de38-023a-433f-9406-730b1b8c8de3/bef7577f-12aa-4726-ab1e-4d65de290939_531359003.jpeg',
    avg_rating: 5,
    reviews_count: 5,
    pack_size: 'Pack size: 55G',
    serving_size: '',
    product_origin: 'Produced in the EU',
    storage_details: 'Store in a cool, dry place out of direct sunlight.',
    ingredients:
      'Dried Onion, Sea Salt, Sugar, Maltodextrin, Flavouring (contains Barley, Wheat), Parsley (6%), Dried Lemon Peel (5%), Dried Orange Peel, Acid (Citric Acid), Dill Seed, Dried Lemon Juice Concentrate (2%), Black Pepper, Dill (2%), Sunflower Oil, Anti-caking Agent (Silicon Dioxide)',
    nutrition:
      "[{'Energy': '1067kJ/253kcal'}, {'Fat - Total': '3.0g'}, {'Fat - Saturated': '0.4g'}, {'Carbohydrate': '46.5g'}, {'- Sugars': '24.8g'}, {'Protein': '6.0g'}, {'Salt': '22.01g'}]",
  },
  {
    sku: 299555755,
    name: "Hearty Food Co Mac 'N' Cheese 400G",
    url: 'https://www.tesco.com/groceries/en-GB/products/299555755',
    gtin13: '05057545678336',
    price: 0.75,
    currency: 'GBP',
    availability: 'InStock',
    description: 'Cheese sauce with cooked macaroni pasta topped with red Cheddar cheese.',
    brand: 'HEARTY FOOD CO.',
    breadcrumbs: 'Frozen Food~Frozen Ready Meals~Frozen Italian & Mediterranean Ready Meals',
    images:
      'https://digitalcontent.api.tesco.com/v2/media/ghs/40ceddbc-46b8-418e-8dbd-516477df6a3f/438f9241-7504-4d0f-827c-db1f85a454d5.jpeg',
    avg_rating: 3.3,
    reviews_count: 57,
    pack_size: 'Pack size: 400G',
    serving_size: '1 Servings',
    product_origin: '',
    storage_details: 'Keep Frozen at -18C or cooler.',
    ingredients: '',
    nutrition:
      "[{'Energy': '511kJ / 121kcal'}, {'Fat': '2.7g'}, {'Saturates': '1.5g'}, {'Carbohydrate': '19.3g'}, {'Sugars': '1.0g'}, {'Fibre': '1.1g'}, {'Protein': '4.4g'}, {'Salt': '0.62g'}]",
  },
  {
    sku: 260691710,
    name: 'Tesco Dijon Mustard 185G',
    url: 'https://www.tesco.com/groceries/en-GB/products/260691710',
    gtin13: '05051140474201',
    price: 0.65,
    currency: 'GBP',
    availability: 'InStock',
    description: 'Dijon mustard.',
    brand: 'TESCO',
    breadcrumbs: 'Food Cupboard~Table Sauces, Olives, Pickles & Chutney~Mustard',
    images:
      'https://digitalcontent.api.tesco.com/v2/media/ghs/2f40e46b-e9f7-45cb-b632-61994e01bc28/a4cd1ab1-8338-4a37-9ecc-a81cd0795277_284196255.jpeg',
    avg_rating: 3.5,
    reviews_count: 30,
    pack_size: 'Pack size: 185G',
    serving_size: '37 Servings',
    product_origin: 'Made using Non-EU mustard seeds.',
    storage_details: 'Store in a cool, dry place. Once opened, keep refrigerated and consume within 8 weeks.',
    ingredients: '',
    nutrition:
      "[{'Energy': '530kJ / 128kcal'}, {'Fat': '9.2g'}, {'Saturates': '0.7g'}, {'Carbohydrate': '3.7g'}, {'Sugars': '2.3g'}, {'Fibre': '2.7g'}, {'Protein': '6.2g'}, {'Salt': '6.2g'}]",
  },
  {
    sku: 255250290,
    name: 'Disaronno Amaretto 50Cl',
    url: 'https://www.tesco.com/groceries/en-GB/products/255250290',
    gtin13: '08001110016372',
    price: 16.5,
    currency: 'GBP',
    availability: 'InStock',
    description:
      "Disaronno Amaretto 50Cl. For great cocktail ideas, visit: www.disaronno.com. The World's Favourite Italian Liqueur",
    brand: 'DISARONNO',
    breadcrumbs: 'Drinks~Spirits~Tequila, Liqueurs & Aperitifs',
    images:
      'https://digitalcontent.api.tesco.com/v2/media/ghs/333feea2-67f0-4d3c-b2ea-7bbe19afc0be/9a3a33aa-b10b-40c9-9601-507eeef5a1ca.jpeg',
    avg_rating: 5,
    reviews_count: 6,
    pack_size: 'Pack size: 50CL',
    serving_size: '',
    product_origin: 'Distributed in the UK',
    storage_details: '',
    ingredients: '',
    nutrition: '[]',
  },
  {
    sku: 299960380,
    name: 'Little Life Buggy Blackout',
    url: 'https://www.tesco.com/groceries/en-GB/products/299960380',
    gtin13: '05031863162203',
    price: 14,
    currency: 'GBP',
    availability: 'InStock',
    description:
      "Little Life Buggy Blackout. A universal fit buggy blackout cover designed for most strollers, pushchairs & buggies with a double door opening,Protects from the sun's UV rays and also protects from flying insects whilst allowing air circulation with a double-layer air-permeable mesh,Designed for most strollers, pushchairs & buggies to protect from the sun (blocks 99% of UV rays)",
    brand: 'LITTLE LIFE',
    breadcrumbs: 'Baby~Toys & Nursery Accessories~Baby & Toddler Travel Accessories',
    images:
      'https://digitalcontent.api.tesco.com/v2/media/ghs/c7cb70f6-faaf-4495-9459-fddad1dd27d2/91359716-2605-44c6-9cea-beb52a6670e1_561989845.jpeg',
    avg_rating: 5,
    reviews_count: 1,
    pack_size: '',
    serving_size: '',
    product_origin: '',
    storage_details: '',
    ingredients: '',
    nutrition: '[]',
  },
  {
    sku: 308462937,
    name: 'Crusha Limited Edition Milk Shake Mix Lime Flavoured 500Ml',
    url: 'https://www.tesco.com/groceries/en-GB/products/308462937',
    gtin13: '05010067310054',
    price: 2,
    currency: 'GBP',
    availability: 'InStock',
    description:
      'Lime flavour milkshake mix with sweeteners. No Artificial Colours or Flavours,No Added Sugar,Suitable for vegetarians',
    brand: 'CRUSHA',
    breadcrumbs: 'Drinks~Milkshake~Milkshake Mix',
    images:
      'https://digitalcontent.api.tesco.com/v2/media/ghs/5fa3dad1-4483-40c6-9a5e-1e1c4618c562/818309b4-2a94-4078-b83c-a8fcc4a95953_618273382.jpeg',
    avg_rating: 3,
    reviews_count: 9,
    pack_size: 'Pack size: 500ML',
    serving_size: '',
    product_origin: '',
    storage_details: 'Best Before End: See Cap. Once opened keep in the fridge and use within 1 month.',
    ingredients:
      'Water, Lime Juice Concentrate, Flavouring, Acid (Citric Acid), Colours (Mixed Carotenes, Copper Chlorophyll), Preservative (Potassium Sorbate), Acidity Regulator (Tri Sodium Citrate), Sweeteners (Sucralose, Acesulfame-K)',
    nutrition:
      "[{'Energy - kJ': '27kJ'}, {'- kcal (Calories)': '6kcal'}, {'Fat': '0.5g'}, {'of which saturates': '0g'}, {'Carbohydrate': '0.4g'}, {'of which sugars': '0.2g'}, {'Protein': '0g'}, {'Salt': '0.10g'}]",
  },
  {
    sku: 309493789,
    name: 'Bisto Onion Gravy Granules 190G',
    url: 'https://www.tesco.com/groceries/en-GB/products/309493789',
    gtin13: '05000354919565',
    price: 2,
    currency: 'GBP',
    availability: 'InStock',
    description:
      'Onion Gravy Granules. Bisto Onion Gravy Granules,The nation\'s favourite,Low in fat and sugar,Suitable for vegetarians and vegans,Easy to make in minutes - just add water',
    brand: 'BISTO',
    breadcrumbs: 'Food Cupboard~Cooking Ingredients~Gravy, Stuffing & Breadcrumbs',
    images:
      'https://digitalcontent.api.tesco.com/v2/media/ghs/37c1df4f-97c6-4fd8-aea3-b50f941552bd/ee0b036c-5514-4897-b604-8121162df93d_307059837.jpeg',
    avg_rating: 4.7,
    reviews_count: 7,
    pack_size: 'Pack size: 190G',
    serving_size: 'This pack makes approximately 57 portions',
    product_origin: '',
    storage_details: 'Store in a cool dry place away from direct heat and sunlight.',
    ingredients:
      'Potato Starch, Maltodextrin, Palm Fat, Salt, Onion Powder (5%), Flavourings (contain Wheat), Wheat Flour, Colour (Ammonia Caramel), Sugar, Dried Onion (1%), Flavour Enhancers, Garlic Powder, Emulsifier (Soya Lecithin), Black Pepper Extract, Rosemary Extract',
    nutrition:
      "[{'Energy (kJ/(kcal)': '1658kJ'}, {'-': '395kcal'}, {'Fat': '15.4g'}, {'of which Saturates': '10.9g'}, {'Carbohydrate': '59.3g'}, {'of which Sugars': '16.9g'}, {'Fibre': '3.2g'}, {'Protein': '3.2g'}, {'Salt': '11.58g'}]",
  },
  {
    sku: 305737088,
    name: 'Tesco Finest Wholemeal Seeds And Grains Bread 800G',
    url: 'https://www.tesco.com/groceries/en-GB/products/305737088',
    gtin13: '05057753893958',
    price: 1.3,
    currency: 'GBP',
    availability: 'InStock',
    description: 'Sliced wholemeal bread with mixed seeds and grains.',
    brand: 'TESCO FINEST',
    breadcrumbs: 'Bakery~Bread & Rolls~Seeded Bread',
    images:
      'https://digitalcontent.api.tesco.com/v2/media/ghs/8f2ae742-2685-44e4-b257-7cbee1b0e862/b2991f2d-ac46-4974-901c-85168f276e20.jpeg',
    avg_rating: 3.4,
    reviews_count: 45,
    pack_size: 'Pack size: 800G',
    serving_size: '18 Servings',
    product_origin: '',
    storage_details: 'Store in a cool dry place. Suitable for home freezing.',
    ingredients: '',
    nutrition:
      "[{'Energy': '1071kJ / 254kcal'}, {'Fat': '5.0g'}, {'Saturates': '0.9g'}, {'Carbohydrate': '37.4g'}, {'Sugars': '2.7g'}, {'Fibre': '6.4g'}, {'Protein': '11.7g'}, {'Salt': '0.98g'}]",
  },
  {
    sku: 311264010,
    name: 'Dove 3In1 Beauty Cream Bar 2X90g',
    url: 'https://www.tesco.com/groceries/en-GB/products/311264010',
    gtin13: '08720181218279',
    price: 1.15,
    currency: 'GBP',
    availability: 'InStock',
    description:
      'Dove 3In1 Beauty Cream Bar 2X90g. Dove Original Beauty Bar has a gentle cleansing formula that effectively cleans hands whilst helping to retain skin moisture',
    brand: 'DOVE',
    breadcrumbs: 'Health & Beauty~Shower, Bath & Hand Hygiene~Handwash',
    images:
      'https://digitalcontent.api.tesco.com/v2/media/ghs/440eeb49-cea2-4bab-babd-3d688b795709/9001ef38-1862-450d-b692-797e8a0c025f_527938748.jpeg~https://digitalcontent.api.tesco.com/v2/media/ghs/a9b2aec5-0a23-4bcc-b183-862a839c2a01/1eebf40e-cbce-41aa-9745-9299adde0eb2_1801372974.jpeg',
    avg_rating: 4.5,
    reviews_count: 120,
    pack_size: 'Pack size: 180G',
    serving_size: '',
    product_origin: 'Germany',
    storage_details: '',
    ingredients:
      'Sodium Lauroyl Isethionate, Stearic Acid, Sodium Palmitate, Lauric Acid, Aqua, Sodium Isethionate, Sodium Stearate, Cocamidopropyl Betaine, Sodium Palm Kernelate, Glycerin',
    nutrition: '[]',
  },
  {
    sku: 308100946,
    name: 'Dairy Pride Uht Skimmed Milk 1 Litre',
    url: 'https://www.tesco.com/groceries/en-GB/products/308100946',
    gtin13: '05000316030055',
    price: 0.7,
    currency: 'GBP',
    availability: 'OutOfStock',
    description:
      'Ultra Heat Treated Skimmed Milk. Longer lasting UHT milk,0.1% fat,British milk,No additives or preservatives',
    brand: 'DP',
    breadcrumbs: 'Fresh Food~Milk, Butter & Eggs~Milk',
    images:
      'https://digitalcontent.api.tesco.com/v2/media/ghs/d2fdb6c5-897e-42b6-97ce-3694e015cdf3/d3632bad-28c4-4448-9d18-36a98474b0fb_2123041940.jpeg',
    avg_rating: 2.3,
    reviews_count: 3,
    pack_size: 'Pack size: 1L',
    serving_size: 'A 1 litre carton contains 5 glasses of a 200ml serving',
    product_origin: '',
    storage_details: 'Once opened, keep refrigerated and use within 3 days.',
    ingredients: 'Skimmed Milk',
    nutrition:
      "[{'Energy': '140kJ/33kcal'}, {'Fat': '0.1g'}, {'Carbohydrate': '4.5g'}, {'Protein': '3.5g'}, {'Salt': '0.11g'}]",
  },
  {
    sku: 311687892,
    name: 'Philadelphia Original Soft Cheese 280G',
    url: 'https://www.tesco.com/groceries/en-GB/products/311687892',
    gtin13: '07622201695521',
    price: 3.25,
    currency: 'GBP',
    availability: 'InStock',
    description:
      'Full fat soft cheese. Fresh and creamy taste,Made with Simply Good Ingredients Milk, Cream, Pinch of Salt,No Preservatives',
    brand: 'PHILADELPHIA',
    breadcrumbs: 'Fresh Food~Cheese~Cottage Cheese & Soft Cheese',
    images:
      'https://digitalcontent.api.tesco.com/v2/media/ghs/c6041f54-fc64-4125-ab23-7a12ccf31fff/06096e7c-ff1d-4009-b171-4b62ee12fcc8_1014290229.jpeg~https://digitalcontent.api.tesco.com/v2/media/ghs/7d4944c7-e163-4605-99c3-2ee605b7e1d3/67bd4b34-343c-4071-9318-b58b4c96db1d_1456603083.jpeg~https://digitalcontent.api.tesco.com/v2/media/ghs/b2bd2369-aebd-4f45-85b4-c49aab6b0d3e/c938e52f-c7e4-41f5-b8fd-176a25debf37_2084004598.jpeg',
    avg_rating: 4.6,
    reviews_count: 55,
    pack_size: 'Pack size: 280G',
    serving_size: '1 portion = 30 g. Contains 9-10 portions',
    product_origin: '',
    storage_details: 'Keep refrigerated. Consume within 1 week of opening.',
    ingredients: 'Full Fat Soft Cheese, Salt, Stabiliser (Locust Bean Gum), Acid (Citric Acid)',
    nutrition:
      "[{'Energy': '933 kJ'}, {'-': '226 kcal'}, {'Fat': '21 g'}, {'of which Saturates': '14 g'}, {'Carbohydrate': '4.3 g'}, {'of which Sugars': '4.3 g'}, {'Protein': '5.4 g'}, {'Salt': '0.75 g'}]",
  },
];

const uniqueCategoryNames = [...new Set(DATASET_PRODUCTS.map((item) => item.breadcrumbs.split('~')[0]))];

export const MOCK_CATEGORIES = uniqueCategoryNames.map((name, index) => ({
  id: index + 1,
  name,
  icon: CATEGORY_ICON_MAP[name] || 'shopping_basket',
}));

const categoryIdByName = Object.fromEntries(MOCK_CATEGORIES.map((category) => [category.name, category.id]));

export const MOCK_PRODUCTS = DATASET_PRODUCTS.map((item, index) => {
  const categoryName = item.breadcrumbs.split('~')[0];
  const category = MOCK_CATEGORIES.find((c) => c.id === categoryIdByName[categoryName]);
  const imageUrls = item.images.split('~').filter(Boolean);
  const inStock = item.availability === 'InStock';

  return {
    id: index + 1,
    name: item.name,
    sku: item.sku,
    gtin13: item.gtin13,
    dataset_url: item.url,
    category_id: category.id,
    category,
    price: Number(item.price),
    currency: item.currency,
    availability: item.availability,
    image_url: imageUrls[0] || '',
    image_urls: imageUrls,
    description: item.description,
    brand: item.brand,
    breadcrumbs: item.breadcrumbs,
    avg_rating: item.avg_rating,
    reviews_count: item.reviews_count,
    pack_size: item.pack_size,
    ingredients: item.ingredients,
    storage_details: item.storage_details,
    product_origin: item.product_origin,
    serving_size: item.serving_size,
    nutrition: item.nutrition,
    in_stock: inStock,
    quantity: inStock ? 25 : 0,
  };
});

// Mock Users
export const MOCK_USERS = {
  legacyCustomer: {
    id: 3,
    name: 'Legacy User',
    email: 'm@g.com',
    password: 'test',
    role: 'customer',
    address: '45 Market Street, Demo City',
  },
  customer: {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'customer',
    address: '123 Fresh Lane, Garden City, GC 12345',
  },
  admin: {
    id: 2,
    name: 'Admin Manager',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    address: null,
  },
};

// Mock Orders
export const MOCK_ORDERS = {
  1: [
    {
      id: 101,
      user_id: 1,
      items: [
        { id: 1, product: MOCK_PRODUCTS[0], quantity: 2 },
        { id: 2, product: MOCK_PRODUCTS[3], quantity: 1 },
      ],
      total_price: 5.05,
      status: 'delivered',
      payment_method: 'Credit Card',
      delivery_address: MOCK_USERS.customer.address,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 102,
      user_id: 1,
      items: [
        { id: 3, product: MOCK_PRODUCTS[8], quantity: 1 },
        { id: 4, product: MOCK_PRODUCTS[1], quantity: 2 },
      ],
      total_price: 6.95,
      status: 'processing',
      payment_method: 'Debit Card',
      delivery_address: MOCK_USERS.customer.address,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

const MOCK_CARTS = {
  1: { items: [], total_items: 0, total_price: 0 },
  2: { items: [], total_items: 0, total_price: 0 },
};

let nextCartItemId = 1000;
let nextOrderId = 10000;

function calculateCartTotals(cart) {
  const total_items = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const total_price = cart.items.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0);
  return {
    ...cart,
    total_items,
    total_price: Number(total_price.toFixed(2)),
  };
}

function ensureCart(userId) {
  if (!MOCK_CARTS[userId]) {
    MOCK_CARTS[userId] = { items: [], total_items: 0, total_price: 0 };
  }
  MOCK_CARTS[userId] = calculateCartTotals(MOCK_CARTS[userId]);
  return MOCK_CARTS[userId];
}

/**
 * Transforms mock data to API response format
 */
export const mockDataService = {
  // Product endpoints
  getProducts: (params) => {
    let products = MOCK_PRODUCTS;
    if (params?.category_id) {
      const categoryId = Number(params.category_id);
      products = products.filter((p) => p.category_id === categoryId);
    }
    return Promise.resolve({ data: products });
  },

  getProduct: (id) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === Number(id));
    if (!product) return Promise.reject({ response: { status: 404 } });
    return Promise.resolve({ data: product });
  },

  getCategories: () => {
    return Promise.resolve({ data: MOCK_CATEGORIES });
  },

  // Auth endpoints
  login: (credentials) => {
    const user = Object.values(MOCK_USERS).find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );
    if (!user) {
      return Promise.reject({
        response: { status: 401, data: { detail: 'Invalid credentials' } },
      });
    }
    const { password, ...safeUser } = user;
    return Promise.resolve({
      data: { user: safeUser, access_token: `mock-token-${user.id}`, token: `mock-token-${user.id}` },
    });
  },

  register: (data) => {
    const newUser = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'customer',
      address: data.address || '',
    };
    return Promise.resolve({
      data: {
        user: { ...newUser, password: undefined },
        access_token: `mock-token-${newUser.id}`,
        token: `mock-token-${newUser.id}`,
      },
    });
  },

  // Cart endpoints
  getCart: (userId) => {
    const cart = ensureCart(userId);
    return Promise.resolve({ data: cart });
  },

  addToCart: (userId, data) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === Number(data.product_id));
    if (!product) {
      return Promise.reject({ response: { status: 404, data: { detail: 'Product not found' } } });
    }
    if (!product.in_stock || product.quantity <= 0) {
      return Promise.reject({ response: { status: 400, data: { detail: 'Product is out of stock' } } });
    }

    const cart = ensureCart(userId);
    const qtyToAdd = Math.max(1, Number(data.quantity) || 1);
    const existing = cart.items.find((item) => item.product_id === product.id);

    if (existing) {
      existing.quantity = Math.min(product.quantity, existing.quantity + qtyToAdd);
    } else {
      cart.items.push({
        id: nextCartItemId++,
        product_id: product.id,
        product,
        quantity: Math.min(product.quantity, qtyToAdd),
      });
    }

    MOCK_CARTS[userId] = calculateCartTotals(cart);
    return Promise.resolve({ data: MOCK_CARTS[userId] });
  },

  updateCartItem: (userId, itemId, data) => {
    const cart = ensureCart(userId);
    const target = cart.items.find((item) => item.id === Number(itemId));
    if (!target) {
      return Promise.reject({ response: { status: 404, data: { detail: 'Cart item not found' } } });
    }

    const maxQty = target.product?.quantity || 99;
    const nextQuantity = Math.max(1, Math.min(maxQty, Number(data.quantity) || 1));
    target.quantity = nextQuantity;
    MOCK_CARTS[userId] = calculateCartTotals(cart);
    return Promise.resolve({ data: MOCK_CARTS[userId] });
  },

  removeCartItem: (userId, itemId) => {
    const cart = ensureCart(userId);
    cart.items = cart.items.filter((item) => item.id !== Number(itemId));
    MOCK_CARTS[userId] = calculateCartTotals(cart);
    return Promise.resolve({ data: MOCK_CARTS[userId] });
  },

  clearCart: (userId) => {
    MOCK_CARTS[userId] = { items: [], total_items: 0, total_price: 0 };
    return Promise.resolve({ data: MOCK_CARTS[userId] });
  },

  // Order endpoints
  getOrderHistory: (userId) => {
    return Promise.resolve({ data: MOCK_ORDERS[userId] || [] });
  },

  getAllOrders: () => {
    const allOrders = Object.values(MOCK_ORDERS).flat();
    return Promise.resolve({ data: allOrders });
  },

  placeOrder: (userId, data) => {
    const cart = ensureCart(userId);
    if (!cart.items.length) {
      return Promise.reject({ response: { status: 400, data: { detail: 'Cart is empty' } } });
    }

    const newOrder = {
      id: nextOrderId++,
      user_id: userId,
      items: cart.items.map((item) => ({ ...item })),
      total_price: cart.total_price,
      total_amount: cart.total_price,
      status: 'pending',
      payment_method: data.payment_method,
      delivery_address: data.delivery_address,
      created_at: new Date().toISOString(),
    };

    if (!MOCK_ORDERS[userId]) {
      MOCK_ORDERS[userId] = [];
    }
    MOCK_ORDERS[userId].unshift(newOrder);
    MOCK_CARTS[userId] = { items: [], total_items: 0, total_price: 0 };

    return Promise.resolve({ data: newOrder });
  },

  updateOrderStatus: (orderId, data) => {
    return Promise.resolve({
      data: { id: orderId, status: data.status },
    });
  },

  // Admin - Product management
  createProduct: (data) => {
    const newProduct = {
      id: Date.now(),
      ...data,
      category: MOCK_CATEGORIES.find((c) => c.id === data.category_id),
    };
    MOCK_PRODUCTS.push(newProduct);
    return Promise.resolve({ data: newProduct });
  },

  updateProduct: (id, data) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === Number(id));
    if (!product) return Promise.reject({ response: { status: 404 } });
    Object.assign(product, data);
    return Promise.resolve({ data: product });
  },

  deleteProduct: (id) => {
    const index = MOCK_PRODUCTS.findIndex((p) => p.id === Number(id));
    if (index === -1) return Promise.reject({ response: { status: 404 } });
    MOCK_PRODUCTS.splice(index, 1);
    return Promise.resolve({ data: { success: true } });
  },
};

/**
 * Enable/disable mock mode for testing
 * When enabled, API calls will use mock data instead of real backend
 */
let mockModeEnabled = false;

export const setMockMode = (enabled) => {
  mockModeEnabled = enabled;
  if (enabled) {
    console.log('%c✓ Mock mode enabled - using test data', 'color: green; font-weight: bold;');
    console.log(
      '%cTest Credentials:\nCustomer: sarah@example.com / password123\nAdmin: admin@example.com / admin123',
      'color: blue; font-weight: bold;'
    );
  } else {
    console.log('%c✗ Mock mode disabled', 'color: red; font-weight: bold;');
  }
};

export const isMockModeEnabled = () => mockModeEnabled;

/**
 * Initialize mock mode based on localStorage or environment
 */
export const initMockMode = () => {
  const mockModeFlag = localStorage.getItem('mock-mode');
  const mockModeEnv = import.meta.env.VITE_MOCK_MODE;

  const shouldEnableByDefault = import.meta.env.DEV && mockModeFlag === null && mockModeEnv == null;

  if (mockModeFlag === 'true' || mockModeEnv === 'true' || mockModeEnv === true || shouldEnableByDefault) {
    setMockMode(true);
  }
};
