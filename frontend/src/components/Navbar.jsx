import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <span className="text-xl font-bold text-green-600">Gro-Cart</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.is_admin && (
                  <Link
                    to="/admin"
                    className="text-sm font-medium text-gray-600 hover:text-green-600"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/orders"
                  className="text-sm font-medium text-gray-600 hover:text-green-600"
                >
                  Orders
                </Link>
                <Link to="/cart" className="relative">
                  <span className="text-2xl">🛒</span>
                  {cart.total_items > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.total_items}
                    </span>
                  )}
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Hi, {user.name?.split(' ')[0]}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-green-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
