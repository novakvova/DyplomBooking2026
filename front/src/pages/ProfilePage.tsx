import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { profileApi } from '../api/api';

const statusLabels: Record<number, string> = {
  0: '⏳ Очікує', 1: '✅ Підтверджено', 2: '❌ Скасовано', 3: '🏁 Завершено',
};
const statusColors: Record<number, string> = {
  0: 'bg-yellow-100 text-yellow-700',
  1: 'bg-green-100 text-green-700',
  2: 'bg-red-100 text-red-700',
  3: 'bg-slate-100 text-slate-700',
};

const ProfilePage = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: profileApi.getMyBookings,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">

      {/* User info */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-xl font-bold text-white">
            {user?.fullName?.[0] ?? user?.email?.[0] ?? 'U'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{user?.fullName ?? 'Користувач'}</h1>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Вийти
        </button>
      </div>

      {/* Bookings */}
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Мої бронювання</h2>

      {isLoading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      )}

      {bookings && bookings.length === 0 && (
        <div className="rounded-2xl bg-slate-50 p-12 text-center text-slate-500">
          🏠 У вас ще немає бронювань
        </div>
      )}

      {bookings && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((b: any) => (
            <div key={b.id} className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-800">{b.housingTitle}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    📅 {new Date(b.checkIn).toLocaleDateString('uk')} → {new Date(b.checkOut).toLocaleDateString('uk')}
                  </p>
                  <p className="text-sm text-slate-500">👥 Гостей: {b.guestsCount}</p>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[b.status]}`}>
                    {statusLabels[b.status]}
                  </span>
                  <p className="mt-2 font-semibold text-slate-800">
                    {b.totalPrice?.toLocaleString()} ₴
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
