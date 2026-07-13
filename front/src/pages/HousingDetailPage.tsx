import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { housingApi } from '../api/api';
import { useAuthStore } from '../store/authStore';
import AuthModal from '../components/AuthModal/AuthModal';

interface BookingForm {
  checkIn: string;
  checkOut: string;
  guestsCount: number;
}

const typeLabels: Record<string, string> = {
  Apartment: 'Квартира', House: 'Будинок',
  Room: 'Кімната', Studio: 'Студія', Villa: 'Вілла',
};

const HousingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [authOpen, setAuthOpen] = useState(false);
  const [booking, setBooking] = useState(false);

  const { data: housing, isLoading } = useQuery({
    queryKey: ['housing', id],
    queryFn: () => housingApi.getById(Number(id)),
    enabled: !!id,
  });

  const { register, handleSubmit, watch } = useForm<BookingForm>({
    defaultValues: {
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      guestsCount: 1,
    },
  });

  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');
  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 1;

  const onBook = async (data: BookingForm) => {
    if (!isAuthenticated) { setAuthOpen(true); return; }

    setBooking(true);
    try {
      await housingApi.book(Number(id), {
        checkIn: new Date(data.checkIn).toISOString(),
        checkOut: new Date(data.checkOut).toISOString(),
        guestsCount: Number(data.guestsCount),
      });
      toast.success('Бронювання успішно створено! 🎉');
      navigate('/profile');
    } catch (err: any) {
      toast.error(err.response?.data ?? 'Помилка бронювання');
    } finally {
      setBooking(false);
    }
  };

  if (isLoading) return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
    </div>
  );

  if (!housing) return (
    <div className="py-20 text-center text-slate-500">Житло не знайдено</div>
  );

  return (
    <>
      <div className="mx-auto max-w-5xl px-6 py-10">

        {/* Back */}
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800">
          ← Назад
        </button>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Left — Info */}
          <div className="lg:col-span-2">
            {/* Photo */}
            <div className="h-72 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-7xl mb-6">
              🏠
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {typeLabels[housing.type] ?? housing.type}
                </span>
                <h1 className="mt-2 text-2xl font-bold text-slate-800">{housing.title}</h1>
                <p className="mt-1 text-slate-500">📍 {housing.city}, {housing.address}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-800">
                  {housing.pricePerNight.toLocaleString()} ₴
                </p>
                <p className="text-sm text-slate-400">за ніч</p>
              </div>
            </div>

            {/* Details */}
            <div className="mt-6 flex gap-6">
              <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
                <p className="text-2xl font-bold text-slate-800">{housing.rooms}</p>
                <p className="text-xs text-slate-500">кімнат</p>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
                <p className="text-2xl font-bold text-slate-800">{housing.maxGuests}</p>
                <p className="text-xs text-slate-500">гостей макс.</p>
              </div>
            </div>

            {housing.description && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-slate-800">Опис</h2>
                <p className="mt-2 text-slate-600 leading-relaxed">{housing.description}</p>
              </div>
            )}
          </div>

          {/* Right — Booking form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Забронювати</h2>

              <form onSubmit={handleSubmit(onBook)} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Заїзд</label>
                  <input
                    type="date"
                    {...register('checkIn', { required: true })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Виїзд</label>
                  <input
                    type="date"
                    {...register('checkOut', { required: true })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Гостей</label>
                  <input
                    type="number"
                    min={1}
                    max={housing.maxGuests}
                    {...register('guestsCount', { required: true, min: 1, max: housing.maxGuests })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                {/* Price summary */}
                <div className="rounded-xl bg-slate-50 p-3 space-y-1 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>{housing.pricePerNight.toLocaleString()} ₴ × {nights} ночей</span>
                    <span>{(housing.pricePerNight * nights).toLocaleString()} ₴</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-800 border-t border-slate-200 pt-1 mt-1">
                    <span>Разом</span>
                    <span>{(housing.pricePerNight * nights).toLocaleString()} ₴</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={booking}
                  className="w-full rounded-xl bg-slate-800 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60"
                >
                  {!isAuthenticated ? '🔐 Увійдіть для бронювання' : booking ? 'Бронювання...' : 'Забронювати'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default HousingDetailPage;
