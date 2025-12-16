import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireEmployee?: boolean; // Added requireEmployee prop
}

export const ProtectedRoute = ({ children, requireAdmin = false, requireEmployee = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isEmployee } = useAuth(); // Added isEmployee

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireEmployee && !isEmployee) { // Added logic for requireEmployee
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
