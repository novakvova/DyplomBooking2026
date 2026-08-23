import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Ban,
  CalendarDays,
  CheckCircle2,
  Heart,
  Home,
  Mail,
  Shield,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";

import { adminUsersApi } from "../../../api/adminApi";
import { getMediaUrl } from "../../../api/client";

// ─────────────────────────────────────────────
// BOOKING STATUS
// Backend повертає BookingStatus як string.
// ─────────────────────────────────────────────

const bookingStatusLabels: Record<string, string> = {
  Pending: "Очікує",
  Confirmed: "Підтверджено",
  Cancelled: "Скасовано",
  Completed: "Завершено",
};

const UserDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [roleError, setRoleError] = useState("");

  // ─────────────────────────────────────────────
  // USER
  // ─────────────────────────────────────────────

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => adminUsersApi.getById(id!),
    enabled: !!id,
  });

  // ─────────────────────────────────────────────
  // REFRESH USER DATA
  // ─────────────────────────────────────────────

  const refreshUser = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["admin-user", id],
    });

    await queryClient.invalidateQueries({
      queryKey: ["admin-users"],
    });
  };

  // ─────────────────────────────────────────────
  // BLOCK
  // ─────────────────────────────────────────────

  const blockMutation = useMutation({
    mutationFn: adminUsersApi.block,

    onSuccess: async () => {
      toast.success("Користувача заблоковано.");
      await refreshUser();
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data ??
          "Не вдалося заблокувати користувача."
      );
    },
  });

  // ─────────────────────────────────────────────
  // UNBLOCK
  // ─────────────────────────────────────────────

  const unblockMutation = useMutation({
    mutationFn: adminUsersApi.unblock,

    onSuccess: async () => {
      toast.success("Користувача розблоковано.");
      await refreshUser();
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data ??
          "Не вдалося розблокувати користувача."
      );
    },
  });

  // ─────────────────────────────────────────────
  // ROLE
  // ─────────────────────────────────────────────

  const roleMutation = useMutation({
    mutationFn: ({userId, role, }: {
      userId: string;
      role: string;
    }) => adminUsersApi.updateRole(userId, role),

    onSuccess: async () => {
      setRoleError("");
      toast.success("Роль користувача змінено.");
      await refreshUser();
    },

    onError: (error: any) => {
      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : "Не вдалося змінити роль користувача.";

      setRoleError(message);
      toast.error(message);
    },
  });

  const handleRoleChange = (role: string) => {
    if (!user || user.roles.includes(role)) return;

    setRoleError("");

    roleMutation.mutate({
      userId: user.id,
      role,
    });
  };

  // ─────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));

  // ─────────────────────────────────────────────
  // STATES
  // ─────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Завантаження...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-8 text-center text-red-600">
        Не вдалося завантажити користувача.
      </div>
    );
  }

  const isUpdating =
    blockMutation.isPending ||
    unblockMutation.isPending ||
    roleMutation.isPending;

  const currentRole = user.roles[0] ?? "Client";

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <div className="p-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/admin/users")}
        className="
          mb-5 flex items-center gap-2 text-sm
          text-slate-500 transition hover:text-slate-800
        "
      >
        <ArrowLeft size={18} />
        До користувачів
      </button>

      {/* Profile */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            {user.avatarPath ? (
              <img
                src={user.avatarPath}
                alt=""
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div
                className="
                  flex h-20 w-20 items-center justify-center
                  rounded-full bg-slate-100 text-slate-500
                "
              >
                <UserRound size={34} />
              </div>
            )}

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {user.fullName || "Без імені"}
              </h1>

              <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <Mail size={15} />
                {user.email}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {user.roles.map((role) => (
                  <span
                    key={role}
                    className="
                      inline-flex items-center gap-1.5
                      rounded-full bg-slate-100 px-3 py-1
                      text-xs font-medium text-slate-700
                    "
                  >
                    {role === "Admin" && <Shield size={13} />}
                    {role}
                  </span>
                ))}

                {user.isBlocked ? (
                  <span
                    className="
                      inline-flex items-center gap-1.5
                      rounded-full bg-red-50 px-3 py-1
                      text-xs font-medium text-red-600
                    "
                  >
                    <Ban size={13} />
                    Заблокований
                  </span>
                ) : (
                  <span
                    className="
                      inline-flex items-center gap-1.5
                      rounded-full bg-green-50 px-3 py-1
                      text-xs font-medium text-green-600
                    "
                  >
                    <CheckCircle2 size={13} />
                    Активний
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Admin actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            {/* Role */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Роль користувача
              </label>

              <select
                value={currentRole}
                disabled={roleMutation.isPending}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="
                  h-11 min-w-[150px] rounded-xl
                  border border-slate-200 bg-white px-4
                  text-sm font-medium text-slate-700
                  outline-none transition
                  focus:border-slate-400
                  disabled:cursor-not-allowed disabled:opacity-60
                "
              >
                <option value="Client">Client</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Block / unblock */}
            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                user.isBlocked
                  ? unblockMutation.mutate(user.id)
                  : blockMutation.mutate(user.id)
              }
              className={`
                h-11 rounded-xl px-5 text-sm
                font-medium transition disabled:opacity-50
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
        </div>

        {roleError && (
          <p className="mt-4 text-sm text-red-600">
            {roleError}
          </p>
        )}

        <p className="mt-5 text-sm text-slate-500">
          Зареєстрований: {formatDate(user.createdAt)}
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <Home size={22} className="text-slate-500" />

          <p className="mt-4 text-2xl font-bold text-slate-900">
            {user.housingsCount}
          </p>

          <p className="text-sm text-slate-500">
            Оголошень
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <CalendarDays size={22} className="text-slate-500" />

          <p className="mt-4 text-2xl font-bold text-slate-900">
            {user.bookingsCount}
          </p>

          <p className="text-sm text-slate-500">
            Бронювань
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <Heart size={22} className="text-slate-500" />

          <p className="mt-4 text-2xl font-bold text-slate-900">
            {user.wishlistCount}
          </p>

          <p className="text-sm text-slate-500">
            У списку бажань
          </p>
        </div>
      </div>

      {/* Housings */}
      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Житло
        </h2>

        {user.housings.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            Користувач ще не додав житло.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {user.housings.map((housing) => (
              <div
                key={housing.id}
                className="overflow-hidden rounded-xl border border-slate-200"
              >
                <div className="h-36 bg-slate-100">
                  {housing.mainPhotoPath ? (
                    <img
                      src={getMediaUrl(housing.mainPhotoPath)}
                      alt={housing.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300">
                      <Home size={30} />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-slate-800">
                    {housing.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {housing.city}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-slate-700">
                      {housing.pricePerNight} / ніч
                    </span>

                    <span
                      className={`text-xs ${
                        housing.isAvailable
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {housing.isAvailable
                        ? "Активне"
                        : "Недоступне"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/housing/${housing.id}`)}
                    className="
                        mt-3 w-full rounded-lg bg-slate-100
                        px-3 py-2 text-sm font-medium
                        text-slate-700 transition
                        hover:bg-slate-200
                    "
                  >
                    Переглянути житло
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bookings */}
      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Бронювання
        </h2>

        {user.bookings.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            Бронювань немає.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Житло</th>
                  <th className="px-4 py-3">Заїзд</th>
                  <th className="px-4 py-3">Виїзд</th>
                  <th className="px-4 py-3">Гості</th>
                  <th className="px-4 py-3">Сума</th>
                  <th className="px-4 py-3">Статус</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {user.bookings.map((booking) => (
                  <tr key={booking.id}
                    onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                    className="cursor-pointer transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">
                      {booking.housingTitle}
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-500">
                      {formatDate(booking.checkIn)}
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-500">
                      {formatDate(booking.checkOut)}
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-500">
                      {booking.guestsCount}
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-500">
                      {booking.totalPrice}
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-500">
                      {bookingStatusLabels[booking.status] ??
                        booking.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Wishlist */}
      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Список бажань
        </h2>

        {user.wishlist.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            Список бажань порожній.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {user.wishlist.map((item) => (
              <div
                key={item.housingId}
                className="overflow-hidden rounded-xl border border-slate-200"
              >
                <div className="h-28 bg-slate-100">
                  {item.mainPhotoPath ? (
                    <img
                      src={getMediaUrl(item.mainPhotoPath)}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300">
                      <Heart size={28} />
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="line-clamp-1 font-medium text-slate-800">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.city}
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-700">
                    {item.pricePerNight} / ніч
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserDetailsPage;