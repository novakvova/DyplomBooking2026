import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import Layout from "./layouts/Layout";

// Public pages
import HomePage from "./pages/HomePage";
import CreateHousingPage from "./pages/CreateHousingPage";
import HousingDetailPage from "./pages/HousingDetailPage";
import ProfilePage from "./pages/ProfilePage";
import BookingPage from "./pages/BookingPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import WishlistPage from "./pages/WishlistPage";

// Housing registration
import HousingRegistrationProviderLayout from "./components/CreateHousing/HousingRegistrationProviderLayout";
import Step01Intro from "./components/CreateHousing/Step01Intro";
import Step02Category from "./components/CreateHousing/Step02Category";
import Step03PropertyType from "./components/CreateHousing/Step03PropertyType";
import Step04RentalFormat from "./components/CreateHousing/Step04RentalFormat";
import Step05AccommodationType from "./components/CreateHousing/Step05AccommodationType";
import Step06BasicInfo from "./components/CreateHousing/Step06BasicInfo";

// Admin
import LoginPage from "./admin/pages/Login";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import AppLayout from "./admin/layout/AppLayout";

import DashboardPage from "./admin/pages/Dashboard/DashboardPage";
import AdminHousingPage from "./admin/pages/Housing/AdminHousingPage";
import AdminBookingsPage from "./admin/pages/Booking/AdminBookingsPage";
import AdminHousingDetailsPage from "./admin/pages/Housing/AdminHousingDetailsPage";
import AdminBookingDetailsPage from "./admin/pages/Booking/AdminBookingDetailsPage";
import AdminReviewsPage from "./admin/pages/Reviews/AdminReviewsPage";
import AdminDestinationsPage from "./admin/pages/Destinations/AdminDestinationsPage";
import AdminDestinationFormPage from "./admin/pages/Destinations/AdminDestinationFormPage";
import RoomsPage from "./admin/pages/Rooms/RoomsPage";
import PaymentsPage from "./admin/pages/Payments/PaymentsPage";
import AdminUsersPage from "./admin/pages/Users/AdminUsersPage";
import AdminUserDetailsPage from "./admin/pages/Users/AdminUserDetailsPage";

// ─────────────────────────────────────────────
// React Query
// ─────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ─────────────────────────────────────────────
// Languages
// ─────────────────────────────────────────────

const SUPPORTED_LANGUAGES = [
  "uk", "en", "zh", "hi", "de", "it", "es", "no",
  "ro", "ar", "nl", "ko", "fr", "sv", "kk", "bn",
  "pl", "lt", "pt", "hr", "el", "ja", "cs", "ka",
];

// ─────────────────────────────────────────────
// Language layout
// Синхронізує мову в URL з i18next
// ─────────────────────────────────────────────

const LanguageLayout = () => {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  const isSupportedLanguage = !!lang && SUPPORTED_LANGUAGES.includes(lang);

  useEffect(() => {
    if (!isSupportedLanguage || !lang) return;

    if (i18n.language !== lang) {
      void i18n.changeLanguage(lang);
    }

    localStorage.setItem("waygo_language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang, i18n, isSupportedLanguage]);

  if (!isSupportedLanguage) {
    return <Navigate to="/uk" replace />;
  }

  return <Layout />;
};

// ─────────────────────────────────────────────
// App
// ─────────────────────────────────────────────

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />

        <Routes>
          {/* Root */}
          <Route path="/" element={<Navigate to="/uk" replace />} />

          {/* Localized public pages */}
          <Route path="/:lang" element={<LanguageLayout />}>
            <Route index element={<HomePage />} />

            <Route path="housing" element={<HomePage />} />
            <Route path="housing/:id" element={<HousingDetailPage />} />

            {/* Housing registration flow */}
            <Route element={<HousingRegistrationProviderLayout />}>
              <Route path="housing/create" element={<CreateHousingPage />} />
              <Route path="housing/register" element={<Step01Intro />} />
              <Route path="housing/register/category" element={<Step02Category />} />
              <Route path="housing/register/property-type" element={<Step03PropertyType />} />
              <Route path="housing/register/rental-format" element={<Step04RentalFormat />} />
              <Route path="housing/register/accommodation-type" element={<Step05AccommodationType />} />
              <Route path="housing/register/basic-info" element={<Step06BasicInfo />} />


            </Route>

            <Route path="profile" element={<ProfilePage />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
          </Route>

          {/* Google OAuth callback */}
          <Route path="/google-callback" element={<GoogleCallbackPage />} />

          {/* Admin login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin */}
          <Route path="/admin">
            <Route
              element={
                <ProtectedRoute requireAdmin>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="users/:id" element={<AdminUserDetailsPage />} />
              <Route path="housing" element={<AdminHousingPage />} />
              <Route path="housing/:id" element={<AdminHousingDetailsPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="bookings/:id" element={<AdminBookingDetailsPage />} />
              <Route path="destinations" element={<AdminDestinationsPage />} />
              <Route path="destinations/new" element={<AdminDestinationFormPage />} />
              <Route path="destinations/:id" element={<AdminDestinationFormPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
              <Route path="rooms" element={<RoomsPage />} />
              <Route path="payments" element={<PaymentsPage />} />

              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Route>

          {/* Unknown URL */}
          <Route path="*" element={<Navigate to="/uk" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;