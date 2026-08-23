import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient,} from "@tanstack/react-query";
import { Search, Shield, UserRound, Ban, CheckCircle2,} from "lucide-react";
import toast from "react-hot-toast";

import { adminUsersApi } from "../../../api/adminApi";
import type { AdminUser } from "../../types/user";

const PAGE_SIZE = 20;

const UsersPage = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  // ─────────────────────────────────────────────
  // USERS
  // ─────────────────────────────────────────────

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "admin-users",
      search,
      role,
      status,
      page,
    ],

    queryFn: () =>
      adminUsersApi.getAll({
        search: search || undefined,
        role: role || undefined,

        isBlocked:
          status === "blocked"
            ? true
            : status === "active"
              ? false
              : undefined,

        page,
        pageSize: PAGE_SIZE,
      }),
  });

  // ─────────────────────────────────────────────
  // BLOCK
  // ─────────────────────────────────────────────

  const blockMutation = useMutation({
    mutationFn: adminUsersApi.block,

    onSuccess: () => {
      toast.success("Користувача заблоковано.");

      void queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },

    onError: () => {
      toast.error(
        "Не вдалося заблокувати користувача."
      );
    },
  });

  // ─────────────────────────────────────────────
  // UNBLOCK
  // ─────────────────────────────────────────────

  const unblockMutation = useMutation({
    mutationFn: adminUsersApi.unblock,

    onSuccess: () => {
      toast.success("Користувача розблоковано.");

      void queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },

    onError: () => {
      toast.error(
        "Не вдалося розблокувати користувача."
      );
    },
  });

  const handleStatusChange = (
    user: AdminUser
  ) => {
    if (user.isBlocked) {
      unblockMutation.mutate(user.id);
    } else {
      blockMutation.mutate(user.id);
    }
  };

  const isUpdating =
    blockMutation.isPending ||
    unblockMutation.isPending;

  // ─────────────────────────────────────────────
  // DATE
  // ─────────────────────────────────────────────

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Користувачі
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Керування користувачами WayGo
        </p>
      </div>

      {/* Filters */}
      <div
        className="
          mb-6 flex flex-col gap-3
          rounded-2xl bg-white p-4
          shadow-sm
          lg:flex-row
          lg:items-center
        "
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="
              absolute left-3 top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            value={search}
            placeholder="Пошук за ім'ям або email"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="
              h-11 w-full rounded-xl
              border border-slate-200
              bg-white pl-10 pr-4
              text-sm outline-none
              transition
              focus:border-slate-400
            "
          />
        </div>

        {/* Role */}
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          className="
            h-11 rounded-xl
            border border-slate-200
            bg-white px-4 text-sm
            text-slate-700 outline-none
          "
        >
          <option value="">
            Усі ролі
          </option>

          <option value="Client">
            Client
          </option>

          <option value="Admin">
            Admin
          </option>
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="
            h-11 rounded-xl
            border border-slate-200
            bg-white px-4 text-sm
            text-slate-700 outline-none
          "
        >
          <option value="">
            Усі статуси
          </option>

          <option value="active">
            Активні
          </option>

          <option value="blocked">
            Заблоковані
          </option>
        </select>
      </div>

      {/* Content */}
      <div
        className="
          overflow-hidden rounded-2xl
          bg-white shadow-sm
        "
      >
        {/* Loading */}
        {isLoading && (
          <div className="p-10 text-center text-slate-500">
            Завантаження...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-10 text-center text-red-600">
            Не вдалося завантажити користувачів.
          </div>
        )}

        {/* Table */}
        {!isLoading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-slate-50">
                  <tr
                    className="
                      text-left text-xs
                      font-semibold uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    <th className="px-5 py-4">
                      Користувач
                    </th>

                    <th className="px-5 py-4">
                      Роль
                    </th>

                    <th className="px-5 py-4 text-center">
                      Житло
                    </th>

                    <th className="px-5 py-4 text-center">
                      Бронювання
                    </th>

                    <th className="px-5 py-4 text-center">
                      Wishlist
                    </th>

                    <th className="px-5 py-4">
                      Статус
                    </th>

                    <th className="px-5 py-4">
                      Реєстрація
                    </th>

                    <th className="px-5 py-4 text-right">
                      Дії
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {data?.items.map((user) => (
                    <tr
                      key={user.id}
                      className="
                        transition
                        hover:bg-slate-50/70
                      "
                    >
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatarPath ? (
                            <img
                              src={user.avatarPath}
                              alt=""
                              className="
                                h-10 w-10
                                rounded-full
                                object-cover
                              "
                            />
                          ) : (
                            <div
                              className="
                                flex h-10 w-10
                                items-center
                                justify-center
                                rounded-full
                                bg-slate-100
                                text-slate-500
                              "
                            >
                              <UserRound size={20} />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p
                              className="
                                truncate
                                font-semibold
                                text-slate-800
                              "
                            >
                              {user.fullName ||
                                "Без імені"}
                            </p>

                            <p
                              className="
                                truncate
                                text-sm
                                text-slate-500
                              "
                            >
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Roles */}
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((roleName) => (
                            <span
                              key={roleName}
                              className="
                                inline-flex
                                items-center gap-1
                                rounded-full
                                bg-slate-100
                                px-2.5 py-1
                                text-xs
                                font-medium
                                text-slate-700
                              "
                            >
                              {roleName === "Admin" && (
                                <Shield size={12} />
                              )}

                              {roleName}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-center text-sm text-slate-600">
                        {user.housingsCount}
                      </td>

                      <td className="px-5 py-4 text-center text-sm text-slate-600">
                        {user.bookingsCount}
                      </td>

                      <td className="px-5 py-4 text-center text-sm text-slate-600">
                        {user.wishlistCount}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {user.isBlocked ? (
                          <span
                            className="
                              inline-flex items-center
                              gap-1.5 rounded-full
                              bg-red-50 px-2.5 py-1
                              text-xs font-medium
                              text-red-600
                            "
                          >
                            <Ban size={13} />
                            Заблокований
                          </span>
                        ) : (
                          <span
                            className="
                              inline-flex items-center
                              gap-1.5 rounded-full
                              bg-green-50 px-2.5 py-1
                              text-xs font-medium
                              text-green-600
                            "
                          >
                            <CheckCircle2 size={13} />
                            Активний
                          </span>
                        )}
                      </td>

                      {/* Created */}
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                            className="
                              rounded-lg bg-slate-100
                              px-3 py-2 text-sm font-medium
                              text-slate-700 transition
                              hover:bg-slate-200
                            "
                          >
                            Переглянути
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleStatusChange(user)}
                            className={`
                              rounded-lg px-3 py-2
                              text-sm font-medium transition
                              disabled:opacity-50
                              ${
                                user.isBlocked
                                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                                  : "bg-red-50 text-red-600 hover:bg-red-100"
                              }
                            `}
                          >
                            {user.isBlocked
                              ? "Розблокувати"
                              : "Заблокувати"}
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
                Користувачів не знайдено.
              </div>
            )}

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div
                className="
                  flex items-center
                  justify-between
                  border-t border-slate-100
                  px-5 py-4
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
                    disabled={
                      page === data.totalPages
                    }
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

export default UsersPage;