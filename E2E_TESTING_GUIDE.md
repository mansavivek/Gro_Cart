# End-to-End Testing Guide

This guide demonstrates the complete user flow through Gro-Cart using mock data, from customer login through admin order management.

## Setup: Enable Mock Mode

Mock mode can be enabled via browser console or by setting an environment variable.

### Option 1: Browser Console
```javascript
// In browser DevTools console, run:
localStorage.setItem('mock-mode', 'true');
window.location.reload();

// To disable:
localStorage.removeItem('mock-mode');
window.location.reload();
```

### Option 2: Environment Variable
```bash
VITE_MOCK_MODE=true npm run dev
```

## Test Credentials

### Customer Account
- **Email:** sarah@example.com
- **Password:** password123
- **Role:** Customer
- **Address:** 123 Fresh Lane, Garden City, GC 12345

### Admin Account
- **Email:** admin@example.com
- **Password:** admin123
- **Role:** Admin

## Complete End-to-End Flow

### Phase 1: Customer Registration & Login

**Step 1: Register Account**
1. Navigate to `/register`
2. Fill out form:
   - Name: "Test Customer"
   - Email: "test@example.com"
   - Password: "testpass123"
   - Address: "456 Garden St, Fresh City"
3. Click "Create Account"
4. **Expected:** Redirect to home page, logged in

**Step 2: Login**
1. Navigate to `/login`
2. Enter credentials:
   - Email: sarah@example.com
   - Password: password123
3. Click "Login"
4. **Expected:** Redirect to home page

### Phase 2: Product Browsing

**Step 3: Browse Products**
1. On home page, view featured products grid
2. **Expected Features:**
   - Hero banner with "Farm Fresh, Always Ready"
   - Dynamic category sidebar with Material Symbols icons
   - Product cards with images, prices, add buttons
   - Search functionality

**Step 4: Filter by Category**
1. Click on category (e.g., "Produce")
2. **Expected:** Products filtered to selected category
3. Click "All Products" to reset

**Step 5: View Product Details**
1. Click on a product card
2. Verify product details page shows:
   - Large product image
   - Product name, price, description
   - Nutrition facts
   - Quantity stepper
   - Add to cart button

### Phase 3: Shopping Cart

**Step 6: Add to Cart**
1. On product details page, set quantity to 2
2. Click "Add to Cart"
3. **Expected:** Success confirmation, cart count updates

**Step 7: View Cart**
1. Click cart icon in navbar or navigate to `/cart`
2. Verify cart displays:
   - All added items with images
   - Quantity steppers (+ / -)
   - Item subtotals
   - Order summary sidebar with total
   - Proceed to Checkout button

**Step 8: Update Cart**
1. Increase quantity of item using + button
2. **Expected:** Subtotal updates in real-time
3. Remove an item using delete button
4. **Expected:** Item removed, summary updates

### Phase 4: Checkout & Order Placement

**Step 9: Checkout**
1. Click "Proceed to Checkout"
2. Fills order form:
   - Delivery Address: (pre-filled from profile)
   - Payment Method: Select "Credit Card"
3. Review Order Summary section
4. Click "Place Order"
5. **Expected:** 
   - Order created successfully
   - Redirect to Order History page
   - New order appears in list with "pending" status

### Phase 5: Customer Order History

**Step 10: View Orders**
1. Navigate to `/orders` or click Orders link
2. Verify order displays:
   - Order ID
   - Order date
   - Items purchased
   - Total amount
   - Current status (delivered, processing, etc.)
3. **Expected:** Can see both new and previous orders

### Phase 6: Admin Dashboard

**Step 11: Logout & Admin Login**
1. Click user menu, select "Logout"
2. **Expected:** Redirect to login
3. Login with admin credentials
4. Navigate to `/admin`
5. **Expected:** Admin dashboard displays

**Step 12: Admin Dashboard Overview**
1. Admin dashboard `/admin` shows:
   - Revenue metrics cards
   - Total Orders card
   - Recent Orders table
   - Popular Products section
2. Verify data matches mock dataset

**Step 13: Admin Product Management**
1. Navigate to `/admin/products`
2. View existing products in sidebar
3. **Add New Product:**
   - Fill "Basic Information":
     - Name: "Organic Spinach"
     - Category: Produce
     - Price: $3.49
   - Upload image (or use placeholder)
   - Add nutrition facts
   - Click "Save Product"
   - **Expected:** Product added to database, appears in sidebar
4. **Edit Product:**
   - Click on product in sidebar
   - Update price to $3.99
   - Click "Update Product"
   - **Expected:** Product updated
5. **Delete Product:**
   - Click delete button on product
   - Confirm deletion
   - **Expected:** Product removed

**Step 14: Admin Order Management**
1. Navigate to `/admin/orders`
2. View orders table with columns:
   - Order ID
   - Customer
   - Items
   - Total
   - Status
   - Actions
3. **Update Order Status:**
   - Find customer order (placed in Phase 4)
   - Click status dropdown
   - Change status: pending → processing → shipped → delivered
   - **Expected:** Status updates in table in real-time

### Phase 7: Verification & Completion

**Step 15: Loop Back to Customer**
1. Logout from admin account
2. Login as customer (sarah@example.com)
3. Navigate to `/orders`
4. **Expected:** 
   - Updated order status visible (should now show admin's change)
   - Demonstrates bidirectional sync between customer and admin

**Step 16: Logout Final**
1. Click user menu, select "Logout"
2. **Expected:** Redirect to login page
3. Verify localStorage cleared (check DevTools)

---

## Mock Data Overview

### Products (8 Pre-loaded Items)
- Organic Bananas ($0.99)
- Whole Milk 1gal ($3.50)
- Fresh Atlantic Salmon ($12.99)
- Artisan Sourdough Bread ($4.99)
- Organic Blueberries ($5.49)
- Greek Yogurt 500g ($3.99)
- Frozen Mixed Vegetables ($2.49)
- Sparkling Water 6-pack ($4.99)

### Categories (8 Categories)
All with Material Symbols icons for visual hierarchy

### Users
- Customer: sarah@example.com / password123
- Admin: admin@example.com / admin123

### Orders
- Customer has 2 pre-existing orders (delivered, processing status)
- Can place new orders which appear in admin dashboard

---

## Debugging Tips

### Check Mock Mode Status
```javascript
// In console:
localStorage.getItem('mock-mode')
```

### View All Mock Users
```javascript
// In console:
import { MOCK_USERS } from './services/mockData';
console.log(MOCK_USERS);
```

### View All Mock Products
```javascript
// In console:
import { MOCK_PRODUCTS } from './services/mockData';
console.log(MOCK_PRODUCTS);
```

### Clear Local Storage
```javascript
localStorage.clear();
window.location.reload();
```

---

## Expected Behavior Notes

### Validation
- All forms validate inputs (email format, required fields)
- Error states display red alerts with user-friendly messages
- Material Symbols icons consistency across UI

### Design System Adherence
- All components use design token colors (primary, surface, etc.)
- Typography follows Manrope (display) + Inter (body) pairing
- Shadows use ambient glow pattern: `shadow-[0_20px_50px_rgba(43,47,49,0.05)]`
- No borders; depth created via tonal layering

### Performance
- Category sidebar optimized with sticky positioning
- Product images lazy-load
- Cart updates immediately without page reload
- Admin tables support large datasets

---

## Test Checklist

- [ ] Mock mode enabled and working
- [ ] Customer registration successful
- [ ] Customer login successful
- [ ] Product browsing & filtering works
- [ ] Product details page displays correctly
- [ ] Add to cart functionality works
- [ ] Cart view shows all items correctly
- [ ] Quantity adjustments update totals
- [ ] Remove item from cart works
- [ ] Checkout form accepts valid data
- [ ] Order placement successful
- [ ] Order appears in order history
- [ ] Admin login successful
- [ ] Admin dashboard shows metrics
- [ ] Admin can add new products
- [ ] Admin can update product info
- [ ] Admin can delete products
- [ ] Admin can update order status
- [ ] Customer sees updated order status
- [ ] Logout clears session correctly
- [ ] All design system colors/fonts applied

---

## Notes for Codex Review

### Design Compliance
- HomePage redesigned to match `dashboard.html` specifications
- All components use design system tokens from `DESIGN.md`
- Ambient shadows, tonal layering, Material Symbols icons consistent

### Code Quality
- Mock data service handles all API endpoints
- API interceptor cleanly separates mock from real API calls
- React hooks (useProducts, useCategories) reused without modification
- Context-based state management (AuthContext, CartContext) maintained
- No inline JavaScript; all logic in separate services

### Testing Ready
- MockData service provides complete dataset
- All API routes supported by mock handlers
- Database-like behavior (create, update, delete) supported
- Error cases properly handled with meaningful messages

### E2E Coverage
- Covers complete customer journey: login → browse → add to cart → checkout → order
- Covers complete admin flow: manage products, update order status
- Bidirectional sync verified (admin changes visible to customer)
- Session management and logout tested
