import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Eye,
  Search,
  Users,
} from "lucide-react";

import { adminBookingsApi } from "../../../api/adminApi";

const PAGE_SIZE = 20;

const bookingStatusLabels: Record<string, string> = {
  Pending: "Очікує",
  Confirmed: "Підтверджено",
  Cancelled: "Скасовано",
  Completed: "Завершено",
};

const bookingStatusStyles: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700",
  Confirmed: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-600",
  Completed: "bg-slate-100 text-slate-700",
};

const BookingsPage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  // ─────────────────────────────────────────────
  // BOOKINGS
  // ─────────────────────────────────────────────

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "admin-bookings",
      search,
      status,
      from,
      to,
      page,
    ],

    queryFn: () =>
      adminBookingsApi.getAll({
        search: search || undefined,
        status: status || undefined,
        from: from || undefined,
        to: to || undefined,
        page,
        pageSize: PAGE_SIZE,
      }),
  });

  // ─────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));

  const resetPage = () => setPage(1);

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Бронювання
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Керування бронюваннями WayGo
        </p>
      </div>

      {/* Filters */}
      <div
        className="
          mb-6 grid gap-3 rounded-2xl
          bg-white p-4 shadow-sm
          lg:grid-cols-[1fr_auto_auto_auto]
        "
      >
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="
              absolute left-3 top-1/2
              -translate-y-1/2 text-slate-400
            "
          />

          <input
            type="text"
            value={search}
            placeholder="Пошук за користувачем або житлом"
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
            className="
              h-11 w-full rounded-xl
              border border-slate-200 bg-white
              pl-10 pr-4 text-sm outline-none
              transition focus:border-slate-400
            "
          />
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            resetPage();
          }}
          className="
            h-11 rounded-xl border
            border-slate-200 bg-white
            px-4 text-sm text-slate-700
            outline-none
          "
        >
          <option value="">
            Усі статуси
          </option>

          <option value="Pending">
            Очікує
          </option>

          <option value="Confirmed">
            Підтверджено
          </option>

          <option value="Cancelled">
            Скасовано
          </option>

          <option value="Completed">
            Завершено
          </option>
        </select>

        {/* From */}
        <input
          type="date"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            resetPage();
          }}
          className="
            h-11 rounded-xl border
            border-slate-200 bg-white
            px-4 text-sm text-slate-700
            outline-none
          "
        />

        {/* To */}
        <input
          type="date"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            resetPage();
          }}
          min={from || undefined}
          className="
            h-11 rounded-xl border
            border-slate-200 bg-white
            px-4 text-sm text-slate-700
            outline-none
          "
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {isLoading && (
          <div className="p-10 text-center text-slate-500">
            Завантаження...
          </div>
        )}

        {error && (
          <div className="p-10 text-center text-red-600">
            Не вдалося завантажити бронювання.
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-slate-50">
                  <tr
                    className="
                      text-left text-xs
                      font-semibold uppercase
                      tracking-wide text-slate-500
                    "
                  >
                    <th className="px-5 py-4">
                      ID
                    </th>

                    <th className="px-5 py-4">
                      Користувач
                    </th>

                    <th className="px-5 py-4">
                      Житло
                    </th>

                    <th className="px-5 py-4">
                      Дати
                    </th>

                    <th className="px-5 py-4">
                      Гості
                    </th>

                    <th className="px-5 py-4">
                      Сума
                    </th>

                    <th className="px-5 py-4">
                      Статус
                    </th>

                    <th className="px-5 py-4 text-right">
                      Дії
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {data?.items.map((booking) => (
                    <tr
                      key={booking.id}
                      className="
                        transition
                        hover:bg-slate-50/70
                      "
                    >
                      {/* ID */}
                      <td className="px-5 py-4 text-sm font-medium text-slate-500">
                        #{booking.id}
                      </td>

                      {/* User */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/users/${booking.userId}`
                            )
                          }
                          className="text-left"
                        >
                          <p className="font-semibold text-slate-800 hover:underline">
                            {booking.userName}
                          </p>

                          <p className="mt-0.5 text-sm text-slate-500">
                            {booking.userEmail}
                          </p>
                        </button>
                      </td>

                      {/* Housing */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/housing/${booking.housingId}`
                            )
                          }
                          className="
                            max-w-[230px] truncate
                            text-left text-sm
                            font-medium text-slate-700
                            hover:underline
                          "
                        >
                          {booking.housingTitle}
                        </button>
                      </td>

                      {/* Dates */}
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-2">
                          <CalendarDays
                            size={16}
                            className="mt-0.5 text-slate-400"
                          />

                          <div className="text-sm text-slate-600">
                            <p>
                              {formatDate(booking.checkIn)}
                            </p>

                            <p className="text-slate-400">
                              → {formatDate(booking.checkOut)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Guests */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Users
                            size={16}
                            className="text-slate-400"
                          />

                          {booking.guestsCount}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                        {booking.totalPrice}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`
                            inline-flex rounded-full
                            px-2.5 py-1
                            text-xs font-medium
                            ${
                              bookingStatusStyles[
                                booking.status
                              ] ??
                              "bg-slate-100 text-slate-700"
                            }
                          `}
                        >
                          {bookingStatusLabels[
                            booking.status
                          ] ?? booking.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/bookings/${booking.id}`
                              )
                            }
                            className="
                              inline-flex items-center gap-2
                              rounded-lg bg-slate-100
                              px-3 py-2 text-sm
                              font-medium text-slate-700
                              transition hover:bg-slate-200
                            "
                          >
                            <Eye size={16} />
                            Переглянути
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty */}
            {data?.items.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                Бронювань не знайдено.
              </div>
            )}

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div
                className="
                  flex flex-col gap-3
                  border-t border-slate-100
                  px-5 py-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <p className="text-sm text-slate-500">
                  Всього: {data.totalItems}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() =>
                      setPage((current) =>
                        Math.max(1, current - 1)
                      )
                    }
                    className="
                      rounded-lg border
                      border-slate-200
                      px-3 py-2 text-sm
                      disabled:opacity-40
                    "
                  >
                    Назад
                  </button>

                  <span className="text-sm text-slate-600">
                    {page} / {data.totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={page === data.totalPages}
                    onClick={() =>
                      setPage((current) =>
                        Math.min(
                          data.totalPages,
                          current + 1
                        )
                      )
                    }
                    className="
                      rounded-lg border
                      border-slate-200
                      px-3 py-2 text-sm
                      disabled:opacity-40
                    "
                  >
                    Далі
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;