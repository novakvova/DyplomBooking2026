import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useCurrency } from "../hooks/useCurrency";
import {housingApi} from "../api/api";
import type {Housing} from "../types/housing";
import {
  paymentsApi,
  PaymentMethod,
  PaymentStatus,
  type HousingBooking,
} from '../api/api';

interface LocationState {
  housing: Housing;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  nights: number;
  total: number;
}

interface PaymentForm {
  method: string;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
}

const methodLabels: Record<string, string> = {
  '0': '💳 Кредитна картка',
  '1': '💳 Дебетова картка',
  '2': '🅿️ PayPal',
  '3': '🏦 Банківський переказ',
};

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { convert, currency } = useCurrency();
  const state = location.state as LocationState;

  const [step, setStep] = useState<'payment' | 'processing' | 'success' | 'failed'>('payment');
  const [payment, setPayment] = useState<{ transactionId: string; amount: number } | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PaymentForm>({
    defaultValues: { method: '0' },
  });

  const selectedMethod = watch('method');
  const isCard = selectedMethod === '0' || selectedMethod === '1';

  // Якщо сторінка відкрита напряму без даних — редірект
  if (!state) {
    navigate('/');
    return null;
  }

  const { housing, checkIn, checkOut, guestsCount, nights, total } = state;

  const onSubmit = async (formData: PaymentForm) => {
    setStep('processing');

    try {
      // Крок 1: Створити бронювання
      const booking: HousingBooking = await housingApi.book(housing.id, {
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        guestsCount,
      });

      // Крок 2: Оплатити
      const cardLastFour = isCard
        ? formData.cardNumber.replace(/\s/g, '').slice(-4)
        : undefined;

      const result = await paymentsApi.payHousingBooking({
        housingBookingId: booking.id,
        method: Number(formData.method) as PaymentMethod,
        cardLastFour,
      });

      if (result.status === PaymentStatus.Paid) {
        setPayment({ transactionId: result.transactionId, amount: result.amount });
        setStep('success');
        toast.success('Оплата успішна! 🎉');
      } else {
        setStep('failed');
        toast.error(result.failureReason ?? 'Оплата відхилена');
      }
    } catch (err: any) {
      setStep('failed');
      toast.error(err.response?.data ?? 'Помилка при бронюванні');
    }
  };

  // ── Стан: Обробка ────────────────────────────────
  if (step === 'processing') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
        <p className="text-slate-600">Обробляємо платіж...</p>
      </div>
    );
  }

  // ── Стан: Успіх ──────────────────────────────────
  if (step === 'success') {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <div className="mb-6 text-6xl">🎉</div>
        <h1 className="text-2xl font-bold text-slate-800">Бронювання підтверджено!</h1>
        <p className="mt-2 text-slate-500">{housing.title}</p>

        <div className="my-8 rounded-2xl bg-green-50 p-6 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Транзакція</span>
            <span className="font-mono font-medium text-slate-800">{payment?.transactionId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Заїзд</span>
            <span className="font-medium text-slate-800">{new Date(checkIn).toLocaleDateString('uk')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Виїзд</span>
            <span className="font-medium text-slate-800">{new Date(checkOut).toLocaleDateString('uk')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Гостей</span>
            <span className="font-medium text-slate-800">{guestsCount}</span>
          </div>
          <div className="flex justify-between border-t border-green-200 pt-3 text-base font-bold">
            <span className="text-slate-700">Сплачено</span>
            <span className="text-green-600">{convert(payment?.amount ?? 0).toLocaleString()} {currency.toUpperCase()}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="flex-1 rounded-xl bg-slate-800 py-3 text-sm font-medium text-white hover:bg-slate-700 transition"
          >
            Мої бронювання
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            На головну
          </button>
        </div>
      </div>
    );
  }

  // ── Стан: Помилка ────────────────────────────────
  if (step === 'failed') {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <div className="mb-6 text-6xl">😞</div>
        <h1 className="text-2xl font-bold text-slate-800">Оплата відхилена</h1>
        <p className="mt-2 text-slate-500">Спробуй ще раз або обери інший спосіб оплати</p>
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => setStep('payment')}
            className="flex-1 rounded-xl bg-slate-800 py-3 text-sm font-medium text-white hover:bg-slate-700 transition"
          >
            Спробувати ще раз
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  // ── Стан: Форма оплати ───────────────────────────
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800">
        ← Назад
      </button>

      <h1 className="mb-8 text-2xl font-bold text-slate-800">Оформлення бронювання</h1>

      <div className="grid gap-8 lg:grid-cols-3">

        {/* Left — Payment form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Спосіб оплати */}
            <div className="rounded-2xl border border-slate-200 p-6">
              <h2 className="mb-4 text-base font-semibold text-slate-800">Спосіб оплати</h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(methodLabels).map(([value, label]) => (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                      selectedMethod === value
                        ? 'border-slate-800 bg-slate-50 font-medium'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={value}
                      {...register('method')}
                      className="accent-slate-800"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Дані картки (тільки для card) */}
            {isCard && (
              <div className="rounded-2xl border border-slate-200 p-6 space-y-4">
                <h2 className="text-base font-semibold text-slate-800">Дані картки</h2>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Номер картки</label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    {...register('cardNumber', {
                      required: isCard ? "Введіть номер картки" : false,
                      minLength: { value: 19, message: 'Введіть повний номер' },
                    })}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                      e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
                    }}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-mono outline-none focus:border-slate-400"
                  />
                  {errors.cardNumber && <p className="mt-1 text-xs text-red-500">{errors.cardNumber.message}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Ім'я власника</label>
                  <input
                    type="text"
                    placeholder="IVAN PETRENKO"
                    {...register('cardName', { required: isCard ? "Введіть ім'я" : false })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase outline-none focus:border-slate-400"
                  />
                  {errors.cardName && <p className="mt-1 text-xs text-red-500">{errors.cardName.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Термін дії</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      {...register('cardExpiry', { required: isCard ? "Введіть термін" : false })}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                        e.target.value = v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v;
                      }}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-mono outline-none focus:border-slate-400"
                    />
                    {errors.cardExpiry && <p className="mt-1 text-xs text-red-500">{errors.cardExpiry.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={3}
                      {...register('cardCvv', { required: isCard ? "Введіть CVV" : false })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-mono outline-none focus:border-slate-400"
                    />
                    {errors.cardCvv && <p className="mt-1 text-xs text-red-500">{errors.cardCvv.message}</p>}
                  </div>
                </div>

                <p className="flex items-center gap-2 text-xs text-slate-400">
                  🔒 Дані захищені шифруванням SSL
                </p>
              </div>
            )}

            {/* PayPal / Bank */}
            {!isCard && (
              <div className="rounded-2xl border border-slate-200 p-6 text-center text-slate-500 text-sm">
                {selectedMethod === '2'
                  ? '🅿️ Ви будете перенаправлені на PayPal після підтвердження'
                  : '🏦 Реквізити для переказу надійдуть на ваш email'}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-800 py-4 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Підтвердити та оплатити {convert(total).toLocaleString()} {currency.toUpperCase()}
            </button>
          </form>
        </div>

        {/* Right — Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-slate-200 p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-800">Ваше бронювання</h2>

            {housing.mainPhotoPath && (
              <img
                src={housing.mainPhotoPath}
                alt={housing.title}
                className="mb-4 h-36 w-full rounded-xl object-cover"
              />
            )}

            <h3 className="font-medium text-slate-800">{housing.title}</h3>
            <p className="mt-1 text-xs text-slate-500">📍 {housing.city}</p>

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Заїзд</span>
                <span className="font-medium">{new Date(checkIn).toLocaleDateString('uk')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Виїзд</span>
                <span className="font-medium">{new Date(checkOut).toLocaleDateString('uk')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Гостей</span>
                <span className="font-medium">{guestsCount}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{convert(housing.pricePerNight).toLocaleString()} {currency.toUpperCase()} × {nights} ночей</span>
                <span className="font-medium">{convert(total).toLocaleString()} {currency.toUpperCase()}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-800">
                <span>Разом</span>
                <span>
                  {convert(total).toLocaleString()} {currency.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingPage;
