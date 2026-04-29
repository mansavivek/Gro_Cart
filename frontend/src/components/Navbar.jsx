import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import grocartLogo from '../assets/grocart-logo.png';

/**
 * Navbar component
 *
 * Props:
 * - `showSearch` boolean: show the search input when true
 * - `searchQuery` string: controlled value for the search input
 * - `onSearchChange` function: callback invoked when search text changes
 *
 * Responsible for rendering top navigation links, cart badge and
 * an account menu. It also handles outside clicks to close the menu.
 */
export default function Navbar({ showSearch = false, searchQuery = '', onSearchChange }) {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const ordersActive = pathname.startsWith('/orders');
  const cartActive = pathname.startsWith('/cart');
  const adminActive = pathname.startsWith('/admin');
  const storeActive = pathname === '/';

  // Close menu, perform logout and redirect to login page.
  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  // Close the account menu when clicking outside of it.
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 lg:px-10 py-3">
      <div className="flex w-full items-center justify-between gap-8">
        <div className="flex items-center gap-16 flex-1">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <img
              alt="Gro-Cart Logo"
              className="h-20 w-auto object-contain"
              src={grocartLogo}
            />
          </Link>

          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-xl relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                className="w-full bg-gray-100 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                placeholder="Search fresh groceries..."
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          {user ? (
            <>
              <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600">
                {user.is_admin && (
                  <>
                    {!adminActive ? <Link to="/admin" className={`transition-colors ${adminActive ? 'text-primary font-semibold' : 'hover:text-primary'}`}>Admin</Link> : null}
                    {adminActive ? <Link to="/" className={`transition-colors ${storeActive ? 'text-primary font-semibold' : 'hover:text-primary'}`}>Store</Link> : null}
                  </>
                )}
                <Link to="/orders" className={`transition-colors ${ordersActive ? 'text-primary font-semibold' : 'hover:text-primary'}`}>Orders</Link>
              </nav>

              <div className="h-6 w-px bg-gray-200 hidden lg:block" />

              <div className="relative flex items-center gap-3" ref={menuRef}>
                <Link
                  to="/cart"
                  className={`relative rounded-full p-2 transition-colors ${cartActive ? 'text-primary bg-primary/10' : 'text-gray-600 hover:bg-gray-100'}`}
                  aria-label="Cart"
                >
                  <span className="material-symbols-outlined">shopping_cart</span>
                  {cart.items.length > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      {cart.total_items}
                    </span>
                  )}
                </Link>

                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  aria-label="Account menu"
                >
                  <span className="material-symbols-outlined">account_circle</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-0 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate('/addresses');
                      }}
                    >
                      Addresses
                    </button>
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate('/payment-methods');
                      }}
                    >
                      Payment Methods
                    </button>
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dim transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}

          {!user && (
            <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-200 text-gray-600">
              <span className="material-symbols-outlined">account_circle</span>
            </div>
          )}
          {user && (
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors lg:hidden" type="button">
              <span className="material-symbols-outlined">menu</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
