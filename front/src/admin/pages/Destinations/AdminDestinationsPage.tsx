import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Eye, MapPin, Plus, Search, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { adminDestinationsApi } from "../../../api/adminApi";
import { getMediaUrl } from "../../../api/client";

const PAGE_SIZE = 20;

const AdminDestinationsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [popular, setPopular] = useState("");
  const [page, setPage] = useState(1);

  // ─────────────────────────────────────────────
  // VIEW TRACKING
  // ─────────────────────────────────────────────

  const { data: tracking } = useQuery({
    queryKey: ["destination-tracking"],
    queryFn: adminDestinationsApi.getTracking,
  });

  const trackingMutation = useMutation({
    mutationFn: adminDestinationsApi.setTracking,
    onSuccess: async () => {
      toast.success("Підрахунок переглядів змінено.");
      await queryClient.invalidateQueries({ queryKey: ["destination-tracking"] });
    },
    onError: () => toast.error("Не вдалося змінити підрахунок переглядів."),
  });

  // ─────────────────────────────────────────────
  // VIEW LIMIT
  // ─────────────────────────────────────────────

  const { data: viewLimit } = useQuery({
    queryKey: ["destination-view-limit"],
    queryFn: adminDestinationsApi.getViewLimit,
  });

  const viewLimitMutation = useMutation({
    mutationFn: adminDestinationsApi.setViewLimit,
    onSuccess: async () => {
      toast.success("Обмеження переглядів змінено.");
      await queryClient.invalidateQueries({ queryKey: ["destination-view-limit"] });
    },
    onError: () => toast.error("Не вдалося змінити обмеження переглядів."),
  });

  // ─────────────────────────────────────────────
  // DESTINATIONS
  // ─────────────────────────────────────────────

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-destinations", search, popular, page],
    queryFn: () =>
      adminDestinationsApi.getAll({
        search: search || undefined,
        isPopular:
          popular === "popular"
            ? true
            : popular === "regular"
              ? false
              : undefined,
        page,
        pageSize: PAGE_SIZE,
      }),
  });

  //----------------------------------------------

  

  // ─────────────────────────────────────────────
  // DESTINATION COUNTS
  // ─────────────────────────────────────────────

  const { data: popularStats } = useQuery({
    queryKey: ["admin-destinations-count", "popular"],
    queryFn: () =>
      adminDestinationsApi.getAll({
        isPopular: true,
        page: 1,
        pageSize: 1,
      }),
  });

  const { data: regularStats } = useQuery({
    queryKey: ["admin-destinations-count", "regular"],
    queryFn: () =>
      adminDestinationsApi.getAll({
        isPopular: false,
        page: 1,
        pageSize: 1,
      }),
  });

  const popularCount = popularStats?.totalItems ?? 0;
  const regularCount = regularStats?.totalItems ?? 0;

  // ─────────────────────────────────────────────
  // POPULAR
  // ─────────────────────────────────────────────

  const popularMutation = useMutation({
    mutationFn: ({ id, isPopular }: { id: number; isPopular: boolean }) =>
      adminDestinationsApi.setPopular(id, isPopular),

    onSuccess: async () => {
      toast.success("Статус напрямку змінено.");

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-destinations"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-destinations-count"] }),
      ]);
    },

    onError: () => toast.error("Не вдалося змінити напрямок."),
  });

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────

  const deleteMutation = useMutation({
    mutationFn: adminDestinationsApi.delete,

    onSuccess: async () => {
      toast.success("Напрямок видалено.");

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-destinations"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-destinations-count"] }),
      ]);
    },

    onError: (error: any) => {
      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : "Не вдалося видалити напрямок.";

      toast.error(message);
    },
  });

  const resetPage = () => setPage(1);

  const trackingEnabled = tracking?.enabled ?? true;
  const viewLimitEnabled = viewLimit?.enabled ?? true;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Напрямки</h1>
          <p className="mt-1 text-sm text-slate-500">Керування напрямками WayGo</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Destination stats */}
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
            <div>
              <p className="text-xs text-slate-400">Популярні</p>
              <p className="mt-0.5 text-lg font-semibold text-amber-700">
                {popularCount}
              </p>
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <div>
              <p className="text-xs text-slate-400">Звичайні</p>
              <p className="mt-0.5 text-lg font-semibold text-slate-700">
                {regularCount}
              </p>
            </div>
          </div>

          {/* Tracking */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
            <div>
              <p className="text-sm font-medium text-slate-700">Підрахунок переглядів</p>
              <p className="text-xs text-slate-400">Збільшувати ViewCount</p>
            </div>

            <button
              type="button"
              disabled={trackingMutation.isPending}
              onClick={() => trackingMutation.mutate(!trackingEnabled)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-50 ${
                trackingEnabled ? "bg-green-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  trackingEnabled ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* 24h limit */}
          <div
            className={`flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 ${
              !trackingEnabled ? "opacity-50" : ""
            }`}
          >
            <div>
              <p className="text-sm font-medium text-slate-700">Обмеження переглядів</p>
              <p className="text-xs text-slate-400">Максимум +1 за 24 години</p>
            </div>

            <button
              type="button"
              disabled={viewLimitMutation.isPending || !trackingEnabled}
              onClick={() => viewLimitMutation.mutate(!viewLimitEnabled)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:cursor-not-allowed ${
                viewLimitEnabled ? "bg-green-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  viewLimitEnabled ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Add */}
          <button
            type="button"
            onClick={() => navigate("/admin/destinations/new")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            <Plus size={17} />
            Додати напрямок
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid gap-3 rounded-2xl bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            placeholder="Пошук за містом, країною або slug"
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        <select
          value={popular}
          onChange={(e) => {
            setPopular(e.target.value);
            resetPage();
          }}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
        >
          <option value="">Усі напрямки</option>
          <option value="popular">Популярні</option>
          <option value="regular">Звичайні</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {isLoading && (
          <div className="p-10 text-center text-slate-500">Завантаження...</div>
        )}

        {error && (
          <div className="p-10 text-center text-red-600">
            Не вдалося завантажити напрямки.
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4">Напрямок</th>
                    <th className="px-5 py-4">Slug</th>
                    <th className="px-5 py-4">ISO</th>
                    <th className="px-5 py-4 text-center">Перегляди</th>
                    <th className="px-5 py-4">Статус</th>
                    <th className="px-5 py-4 text-right">Дії</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {data?.items.map((destination) => (
                    <tr
                      key={destination.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      {/* Destination */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            {getMediaUrl(destination.imagePath) ? (
                              <img
                                src={getMediaUrl(destination.imagePath)}
                                alt={destination.city}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-slate-300">
                                <MapPin size={20} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800">
                              {destination.city}, {destination.country}
                            </p>

                            <p className="mt-1 max-w-[350px] truncate text-sm text-slate-500">
                              {destination.description || "Без опису"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {destination.slug}
                        </span>
                      </td>

                      {/* ISO */}
                      <td className="px-5 py-4 text-sm font-medium text-slate-600">
                        {destination.countryCode}
                      </td>

                      {/* Views */}
                      <td className="px-5 py-4 text-center text-sm text-slate-600">
                        {destination.viewCount}
                      </td>

                      {/* Popular */}
                      <td className="px-5 py-4">
                        {destination.isPopular ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                            <Star size={13} />
                            Популярний
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            Звичайний
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/destinations/${destination.id}`)
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                          >
                            <Eye size={16} />
                            Редагувати
                          </button>

                          <button
                            type="button"
                            disabled={popularMutation.isPending}
                            onClick={() =>
                              popularMutation.mutate({
                                id: destination.id,
                                isPopular: !destination.isPopular,
                              })
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
                          >
                            <Star size={16} />
                            {destination.isPopular ? "Прибрати" : "В популярні"}
                          </button>

                          <button
                            type="button"
                            disabled={deleteMutation.isPending}
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Видалити напрямок "${destination.city}"?`
                                )
                              ) {
                                deleteMutation.mutate(destination.id);
                              }
                            }}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                            Видалити
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data?.items.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                Напрямків не знайдено.
              </div>
            )}

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Всього: {data.totalItems}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40"
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
                        Math.min(data.totalPages, current + 1)
                      )
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40"
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

export default AdminDestinationsPage;