import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import { adminReviewsApi } from "../../../api/adminApi";

const PAGE_SIZE = 20;

const AdminReviewsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("");
  const [visibility, setVisibility] = useState("");
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "admin-reviews",
      search,
      rating,
      visibility,
      page,
    ],

    queryFn: () =>
      adminReviewsApi.getAll({
        search: search || undefined,
        rating: rating
          ? Number(rating)
          : undefined,
        isVisible:
          visibility === "visible"
            ? true
            : visibility === "hidden"
              ? false
              : undefined,
        page,
        pageSize: PAGE_SIZE,
      }),
  });

  const visibilityMutation = useMutation({
    mutationFn: ({
      id,
      isVisible,
    }: {
      id: number;
      isVisible: boolean;
    }) =>
      adminReviewsApi.setVisibility(
        id,
        isVisible
      ),

    onSuccess: async () => {
      toast.success("Статус відгуку змінено.");

      await queryClient.invalidateQueries({
        queryKey: ["admin-reviews"],
      });
    },

    onError: () => {
      toast.error("Не вдалося змінити відгук.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminReviewsApi.delete,

    onSuccess: async () => {
      toast.success("Відгук видалено.");

      await queryClient.invalidateQueries({
        queryKey: ["admin-reviews"],
      });
    },

    onError: () => {
      toast.error("Не вдалося видалити відгук.");
    },
  });

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Відгуки
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Модерація відгуків WayGo
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 grid gap-3 rounded-2xl bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            placeholder="Пошук за користувачем, житлом або текстом"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <select
          value={rating}
          onChange={(e) => {
            setRating(e.target.value);
            setPage(1);
          }}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm"
        >
          <option value="">Усі оцінки</option>
          <option value="5">5 ★</option>
          <option value="4">4 ★</option>
          <option value="3">3 ★</option>
          <option value="2">2 ★</option>
          <option value="1">1 ★</option>
        </select>

        <select
          value={visibility}
          onChange={(e) => {
            setVisibility(e.target.value);
            setPage(1);
          }}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm"
        >
          <option value="">Усі статуси</option>
          <option value="visible">Видимі</option>
          <option value="hidden">Приховані</option>
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
            Не вдалося завантажити відгуки.
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4">Користувач</th>
                    <th className="px-5 py-4">Житло</th>
                    <th className="px-5 py-4">Оцінка</th>
                    <th className="px-5 py-4">Відгук</th>
                    <th className="px-5 py-4">Статус</th>
                    <th className="px-5 py-4">Дата</th>
                    <th className="px-5 py-4 text-right">Дії</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {data?.items.map((review) => (
                    <tr
                      key={review.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/users/${review.userId}`)
                          }
                          className="text-left"
                        >
                          <p className="font-semibold text-slate-800 hover:underline">
                            {review.userName}
                          </p>

                          <p className="text-xs text-slate-400">
                            {review.userEmail}
                          </p>
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/housing/${review.housingId}`)
                          }
                          className="max-w-[220px] truncate text-sm font-medium text-slate-700 hover:underline"
                        >
                          {review.housingTitle}
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                          <Star size={16} />
                          {review.rating}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-[320px] line-clamp-2 text-sm text-slate-600">
                          {review.comment}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            review.isVisible
                              ? "bg-green-50 text-green-600"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {review.isVisible
                            ? "Видимий"
                            : "Прихований"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(review.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={visibilityMutation.isPending}
                            onClick={() =>
                              visibilityMutation.mutate({
                                id: review.id,
                                isVisible: !review.isVisible,
                              })
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200"
                          >
                            {review.isVisible ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}

                            {review.isVisible
                              ? "Приховати"
                              : "Показати"}
                          </button>

                          <button
                            type="button"
                            disabled={deleteMutation.isPending}
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Видалити цей відгук?"
                                )
                              ) {
                                deleteMutation.mutate(review.id);
                              }
                            }}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 transition hover:bg-red-100"
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
                Відгуків не знайдено.
              </div>
            )}

            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
                <p className="text-sm text-slate-500">
                  Всього: {data.totalItems}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() =>
                      setPage((value) =>
                        Math.max(1, value - 1)
                      )
                    }
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
                      setPage((value) =>
                        Math.min(
                          data.totalPages,
                          value + 1
                        )
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

export default AdminReviewsPage;