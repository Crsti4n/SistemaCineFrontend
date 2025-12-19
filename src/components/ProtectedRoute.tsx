import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireEmployee?: boolean;
  requireSuperUsuario?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false, requireEmployee = false, requireSuperUsuario = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isEmployee, isSuperUsuario } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireEmployee && !isEmployee) {
    return <Navigate to="/" replace />;
  }

  if (requireSuperUsuario && !isSuperUsuario) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
