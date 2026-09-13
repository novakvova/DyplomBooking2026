import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: Props) => {
  const { isAuthenticated, isAdmin, _hasHydrated } = useAuthStore();
  const location = useLocation();

  // zustand-persist читає localStorage асинхронно. Без цієї перевірки
  // перший рендер завжди бачив isAuthenticated=false (стан ще не
  // підвантажено з localStorage) і миттєво редіректив на /login —
  // навіть якщо валідний токен уже лежав у сховищі. Далі стан
  // гідратувався, ProtectedRoute пропускав користувача на /admin,
  // але при наступному оновленні сторінки все повторювалось знову,
  // створюючи враження "постійно просить логін".
  if (!_hasHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    // Зберігаємо звідки прийшли щоб повернутись після логіну
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
