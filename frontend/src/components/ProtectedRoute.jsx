import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 *
 * Simple wrapper to guard routes that require authentication. When
 * `adminOnly` is true the route also requires `user.is_admin`.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  // If not authenticated, redirect to login.
  if (!user) return <Navigate to="/login" replace />;
  // If the route is admin-only and the user is not an admin, redirect to store.
  if (adminOnly && !user.is_admin) return <Navigate to="/" replace />;

  return children;
}
