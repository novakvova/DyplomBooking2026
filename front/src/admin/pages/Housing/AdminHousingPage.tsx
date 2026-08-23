import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Eye,
  Home,
  Search,
  UserRound,
} from "lucide-react";

import { adminHousingApi } from "../../../api/adminApi";
import { getMediaUrl } from "../../../api/client";

const PAGE_SIZE = 20;

const typeLabels: Record<string, string> = {
  Apartment: "Квартира",
  House: "Будинок",
  Room: "Кімната",
  Studio: "Студія",
  Villa: "Вілла",
};

const AdminHousingPage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  // ─────────────────────────────────────────────
  // HOUSINGS
  // ─────────────────────────────────────────────

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "admin-housings",
      search,
      type,
      status,
      page,
    ],

    queryFn: () =>
      adminHousingApi.getAll({
        search: search || undefined,
        type: type || undefined,
        isAvailable:
          status === "active"
            ? true
            : status === "inactive"
              ? false
              : undefined,
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
          Житло
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Керування оголошеннями WayGo
        </p>
      </div>

      {/* Filters */}
      <div
        className="
          mb-6 grid gap-3 rounded-2xl
          bg-white p-4 shadow-sm
          lg:grid-cols-[1fr_auto_auto]
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
            placeholder="Пошук за житлом, містом або власником"
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

        {/* Type */}
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            resetPage();
          }}
          className="
            h-11 rounded-xl border
            border-slate-200 bg-white
            px-4 text-sm text-slate-700
            outline-none
          "
        >
          <option value="">Усі типи</option>
          <option value="Apartment">Квартири</option>
          <option value="House">Будинки</option>
          <option value="Room">Кімнати</option>
          <option value="Studio">Студії</option>
          <option value="Villa">Вілли</option>
        </select>

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
          <option value="">Усі статуси</option>
          <option value="active">Активні</option>
          <option value="inactive">Неактивні</option>
        </select>
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
            Не вдалося завантажити житло.
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px]">
                <thead className="bg-slate-50">
                  <tr
                    className="
                      text-left text-xs font-semibold
                      uppercase tracking-wide text-slate-500
                    "
                  >
                    <th className="px-5 py-4">
                      Житло
                    </th>

                    <th className="px-5 py-4">
                      Тип
                    </th>

                    <th className="px-5 py-4">
                      Власник
                    </th>

                    <th className="px-5 py-4">
                      Ціна
                    </th>

                    <th className="px-5 py-4 text-center">
                      Бронювання
                    </th>

                    <th className="px-5 py-4">
                      Статус
                    </th>

                    <th className="px-5 py-4">
                      Створено
                    </th>

                    <th className="px-5 py-4 text-right">
                      Дії
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {data?.items.map((housing) => (
                    <tr
                      key={housing.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      {/* Housing */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            {housing.mainPhotoPath ? (
                              <img
                                src={getMediaUrl(housing.mainPhotoPath)}
                                alt={housing.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-slate-300">
                                <Home size={20} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[250px] truncate font-semibold text-slate-800">
                              {housing.title}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {housing.city}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {typeLabels[housing.type] ??
                            housing.type}
                        </span>
                      </td>

                      {/* Owner */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/users/${housing.ownerId}`
                            )
                          }
                          className="flex items-center gap-2 text-left"
                        >
                          <UserRound
                            size={17}
                            className="text-slate-400"
                          />

                          <div>
                            <p className="text-sm font-medium text-slate-700 hover:underline">
                              {housing.ownerName}
                            </p>

                            <p className="text-xs text-slate-400">
                              {housing.ownerEmail}
                            </p>
                          </div>
                        </button>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                        {housing.pricePerNight}
                      </td>

                      {/* Bookings */}
                      <td className="px-5 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                          <CalendarDays
                            size={16}
                            className="text-slate-400"
                          />
                          {housing.bookingsCount}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {housing.isAvailable ? (
                          <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                            Активне
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                            Неактивне
                          </span>
                        )}
                      </td>

                      {/* Created */}
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(housing.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/housing/${housing.id}`
                              )
                            }
                            className="
                              inline-flex items-center gap-2
                              rounded-lg bg-slate-100
                              px-3 py-2 text-sm font-medium
                              text-slate-700 transition
                              hover:bg-slate-200
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
                Житло не знайдено.
              </div>
            )}

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div
                className="
                  flex flex-col gap-3
                  border-t border-slate-100
                  px-5 py-4
                  sm:flex-row sm:items-center
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
                      rounded-lg border border-slate-200
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
                      rounded-lg border border-slate-200
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

export default AdminHousingPage;