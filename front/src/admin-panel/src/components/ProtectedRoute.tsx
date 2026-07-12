import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: Props) => {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Зберігаємо звідки прийшли щоб повернутись після логіну
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
