import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Home,
  Mail,
  MapPin,
  UserRound,
  Users,
} from "lucide-react";

import { adminBookingsApi } from "../../../api/adminApi";

const bookingStatusStyles: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700",
  Confirmed: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-600",
  Completed: "bg-slate-100 text-slate-700",
};

const bookingStatusLabels: Record<string, string> = {
  Pending: "Очікує",
  Confirmed: "Підтверджено",
  Cancelled: "Скасовано",
  Completed: "Завершено",
};

const paymentStatusLabels: Record<string, string> = {
  Pending: "Очікує",
  Processing: "Обробляється",
  Paid: "Оплачено",
  Failed: "Відхилено",
  Refunded: "Повернено",
};

const getAvailableStatuses = (status: string) => {
  switch (status) {
    case "Pending":
      return ["Pending", "Confirmed", "Cancelled"];

    case "Confirmed":
      return ["Confirmed", "Completed", "Cancelled"];

    case "Cancelled":
      return ["Cancelled"];

    case "Completed":
      return ["Completed"];

    default:
      return [status];
  }
};

const AdminBookingDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const bookingId = Number(id);

  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-booking", bookingId],
    queryFn: () => adminBookingsApi.getById(bookingId),
    enabled: Number.isFinite(bookingId),
  });

  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: (status: string) =>
        adminBookingsApi.updateStatus(bookingId, status),

    onSuccess: async () => {
        await queryClient.invalidateQueries({
        queryKey: ["admin-booking", bookingId],
        });
    },

    onError: (error) => {
        console.error("Не вдалося змінити статус бронювання:", error);
    },
  });

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Завантаження...
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-8 text-center text-red-600">
        Не вдалося завантажити бронювання.
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-5 flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
      >
        <ArrowLeft size={18} />
        Назад
      </button>

      {/* Header */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Бронювання #{booking.id}
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {booking.housingTitle}
            </h1>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <MapPin size={16} />
              {booking.housingCity}
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            {/* Current status */}
            <span
                className={`inline-flex w-fit rounded-full px-3 py-1.5 text-sm font-medium ${
                bookingStatusStyles[booking.status] ??
                "bg-slate-100 text-slate-700"
                }`}
            >
                {bookingStatusLabels[booking.status] ?? booking.status}
            </span>

            {/* Change status */}
            <select
                value={booking.status}
                disabled={
                statusMutation.isPending ||
                booking.status === "Cancelled" ||
                booking.status === "Completed"
                }
                onChange={(e) =>
                statusMutation.mutate(e.target.value)
                }
                className="
                h-11 rounded-xl border border-slate-200
                bg-white px-4 text-sm font-medium
                text-slate-700 outline-none transition
                focus:border-slate-400
                disabled:cursor-not-allowed disabled:opacity-60
                "
            >
                {getAvailableStatuses(booking.status).map((status) => (
                <option key={status} value={status}>
                    {bookingStatusLabels[status] ?? status}
                </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main info */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        {/* Housing */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Житло
          </h2>

          <div className="mt-4 overflow-hidden rounded-xl bg-slate-100">
            {booking.housingMainPhotoPath ? (
              <img
                src={booking.housingMainPhotoPath}
                alt={booking.housingTitle}
                className="h-[260px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[260px] items-center justify-center text-slate-300">
                <Home size={34} />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(`/admin/housing/${booking.housingId}`)
            }
            className="mt-4 w-full rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Переглянути житло
          </button>
        </section>

        {/* Booking */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Деталі бронювання
          </h2>

          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-3">
              <CalendarDays size={19} className="text-slate-400" />

              <div>
                <p className="text-xs text-slate-400">
                  Заїзд
                </p>

                <p className="text-sm font-medium text-slate-700">
                  {formatDate(booking.checkIn)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays size={19} className="text-slate-400" />

              <div>
                <p className="text-xs text-slate-400">
                  Виїзд
                </p>

                <p className="text-sm font-medium text-slate-700">
                  {formatDate(booking.checkOut)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users size={19} className="text-slate-400" />

              <div>
                <p className="text-xs text-slate-400">
                  Гості
                </p>

                <p className="text-sm font-medium text-slate-700">
                  {booking.guestsCount}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-400">
                Загальна сума
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {booking.totalPrice}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* User */}
      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Користувач
        </h2>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <UserRound size={22} />
            </div>

            <div>
              <p className="font-semibold text-slate-800">
                {booking.userName}
              </p>

              <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <Mail size={14} />
                {booking.userEmail}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(`/admin/users/${booking.userId}`)
            }
            className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Переглянути користувача
          </button>
        </div>
      </section>

      {/* Payment */}
      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <CreditCard size={20} className="text-slate-500" />

          <h2 className="text-lg font-bold text-slate-900">
            Оплата
          </h2>
        </div>

        {!booking.payment ? (
          <p className="mt-4 text-sm text-slate-500">
            Оплату для цього бронювання не знайдено.
          </p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-slate-400">
                Сума
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {booking.payment.amount}{" "}
                {booking.payment.currency.toUpperCase()}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Статус
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {paymentStatusLabels[booking.payment.status] ??
                  booking.payment.status}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Метод
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {booking.payment.method}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Дата
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {formatDate(booking.payment.createdAt)}
              </p>
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <p className="text-xs text-slate-400">
                Transaction ID
              </p>

              <p className="mt-1 break-all text-sm text-slate-600">
                {booking.payment.transactionId}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminBookingDetailsPage;