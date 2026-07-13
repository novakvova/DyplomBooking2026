import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import Layout from './layouts/Layout';

import HomePage from './pages/HomePage';
import HousingDetailPage from './pages/HousingDetailPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from "./admin/pages/Login.tsx";
import ProtectedRoute from "./admin/components/ProtectedRoute.tsx";
import AppLayout from "./admin/layout/AppLayout.tsx";
import DashboardPage from "./admin/pages/Dashboard/DashboardPage.tsx";
import HousingPage from "./admin/pages/Housing/HousingPage.tsx";
import RoomsPage from "./admin/pages/Rooms/RoomsPage.tsx";
import BookingsPage from "./admin/pages/Bookings/BookingsPage.tsx";
import PaymentsPage from "./admin/pages/Payments/PaymentsPage.tsx";

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
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="housing" element={<HomePage />} />
              <Route path="housing/:id" element={<HousingDetailPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            {/* Публічний маршрут */}
            <Route path="/login" element={<LoginPage />} />
            <Route path={"/admin"}>


              {/* Захищені маршрути — AppLayout містить <Outlet /> */}
              <Route
                  element={
                    <ProtectedRoute requireAdmin>
                      <AppLayout />
                    </ProtectedRoute>
                  }
              >
                <Route index element={<DashboardPage />} />
                <Route path="housing" element={<HousingPage />} />
                <Route path="rooms" element={<RoomsPage />} />
                <Route path="bookings" element={<BookingsPage />} />
                <Route path="payments" element={<PaymentsPage />} />
              </Route>

              {/* Будь-який невідомий маршрут → головна */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
  );
}

export default App;