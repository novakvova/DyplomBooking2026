import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layout/AppLayout';
import LoginPage from './pages/Login';

import DashboardPage from './pages/Dashboard/DashboardPage';
import HousingPage from './pages/Housing/HousingPage';
import RoomsPage from './pages/Rooms/RoomsPage';
import BookingsPage from './pages/Bookings/BookingsPage';
import PaymentsPage from './pages/Payments/PaymentsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>

          {/* Публічний маршрут */}
          <Route path="/login" element={<LoginPage />} />

          {/* Захищені маршрути — AppLayout містить <Outlet /> */}
          <Route
            element={
              <ProtectedRoute requireAdmin>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/housing" element={<HousingPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
          </Route>

          {/* Будь-який невідомий маршрут → головна */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
