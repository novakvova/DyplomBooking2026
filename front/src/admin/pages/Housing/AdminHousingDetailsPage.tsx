import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  CircleX,
  Mail,
  MapPin,
  Power,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import { adminHousingApi } from "../../../api/adminApi";
import { getMediaUrl } from "../../../api/client";

const AdminHousingDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const housingId = Number(id);

  // ─────────────────────────────────────────────
  // HOUSING
  // ─────────────────────────────────────────────

  const {
    data: housing,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-housing", housingId],
    queryFn: () => adminHousingApi.getById(housingId),
    enabled: Number.isFinite(housingId),
  });

  // ─────────────────────────────────────────────
  // AVAILABILITY
  // ─────────────────────────────────────────────

  const availabilityMutation = useMutation({
    mutationFn: ({
      id,
      isAvailable,
    }: {
      id: number;
      isAvailable: boolean;
    }) => adminHousingApi.setAvailability(id, isAvailable),

    onSuccess: async () => {
      toast.success("Статус оголошення змінено.");

      await queryClient.invalidateQueries({
        queryKey: ["admin-housing", housingId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },

    onError: () => {
      toast.error("Не вдалося змінити статус оголошення.");
    },
  });

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────

  const deleteMutation = useMutation({
    mutationFn: adminHousingApi.delete,

    onSuccess: () => {
      toast.success("Оголошення видалено.");
      navigate("/admin/housing");
    },

    onError: (error: any) => {
      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : "Не вдалося видалити оголошення.";

      toast.error(message);
    },
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

  if (error || !housing) {
    return (
      <div className="p-8 text-center text-red-600">
        Не вдалося завантажити житло.
      </div>
    );
  }

  const mainPhoto =
    housing.photos.find((photo) => photo.isMain) ??
    housing.photos[0];

  const isUpdating =
    availabilityMutation.isPending ||
    deleteMutation.isPending;

  // ─────────────────────────────────────────────
  // DELETE CONFIRM
  // ─────────────────────────────────────────────

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Ви впевнені, що хочете видалити це оголошення?"
    );

    if (confirmed) {
      deleteMutation.mutate(housing.id);
    }
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <div className="p-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="
          mb-5 flex items-center gap-2 text-sm text-slate-500
          transition hover:text-slate-800
        "
      >
        <ArrowLeft size={18} />
        Назад
      </button>

      {/* Header */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Main photo */}
          <div className="h-[260px] w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 lg:w-[380px]">
            {mainPhoto ? (
              <img
                src={getMediaUrl(mainPhoto.filePath)}
                alt={housing.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Немає фото
              </div>
            )}
          </div>

          {/* Information */}
          <div className="min-w-0 flex-1">
            {/* Title + actions */}
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-slate-900">
                  {housing.title}
                </h1>

                <div className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                  <MapPin size={16} className="mt-0.5 shrink-0" />

                  <span>
                    {housing.city}, {housing.address}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-3 xl:items-end">
                {/* Status */}
                {housing.isAvailable ? (
                  <span
                    className="
                      inline-flex w-fit items-center gap-1.5
                      rounded-full bg-green-50 px-3 py-1.5
                      text-sm font-medium text-green-600
                    "
                  >
                    <CheckCircle2 size={15} />
                    Активне
                  </span>
                ) : (
                  <span
                    className="
                      inline-flex w-fit items-center gap-1.5
                      rounded-full bg-red-50 px-3 py-1.5
                      text-sm font-medium text-red-600
                    "
                  >
                    <CircleX size={15} />
                    Недоступне
                  </span>
                )}

                {/* Admin actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() =>
                      availabilityMutation.mutate({
                        id: housing.id,
                        isAvailable: !housing.isAvailable,
                      })
                    }
                    className={`
                      inline-flex items-center gap-2 rounded-xl
                      px-4 py-2.5 text-sm font-medium transition
                      disabled:cursor-not-allowed disabled:opacity-50
                      ${
                        housing.isAvailable
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }
                    `}
                  >
                    <Power size={16} />

                    {availabilityMutation.isPending
                      ? "Збереження..."
                      : housing.isAvailable
                        ? "Деактивувати"
                        : "Активувати"}
                  </button>

                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={handleDelete}
                    className="
                      inline-flex items-center gap-2 rounded-xl
                      bg-red-50 px-4 py-2.5 text-sm
                      font-medium text-red-600 transition
                      hover:bg-red-100 disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <Trash2 size={16} />

                    {deleteMutation.isPending
                      ? "Видалення..."
                      : "Видалити"}
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="mt-5 text-sm leading-6 text-slate-600">
              {housing.description || "Опис відсутній."}
            </p>

            {/* Housing information */}
            <div className="mt-6 flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <BedDouble size={18} />
                {housing.rooms} кімн.
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users size={18} />
                До {housing.maxGuests} гостей
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CalendarDays size={18} />
                {housing.bookingsCount} бронювань
              </div>
            </div>

            {/* Price */}
            <div className="mt-6">
              <span className="text-2xl font-bold text-slate-900">
                {housing.pricePerNight}
              </span>

              <span className="ml-1 text-sm text-slate-500">
                / ніч
              </span>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Створено: {formatDate(housing.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Тип житла
          </p>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {housing.type}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Бронювання
          </p>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {housing.bookingsCount}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Максимум гостей
          </p>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {housing.maxGuests}
          </p>
        </div>
      </div>

      {/* Owner */}
      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Власник
        </h2>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="
                flex h-12 w-12 items-center justify-center
                rounded-full bg-slate-100 text-slate-500
              "
            >
              <UserRound size={22} />
            </div>

            <div>
              <p className="font-semibold text-slate-800">
                {housing.ownerName}
              </p>

              <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <Mail size={14} />
                {housing.ownerEmail || "Email відсутній"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(`/admin/users/${housing.ownerId}`)
            }
            className="
              rounded-xl bg-slate-100 px-4 py-2.5
              text-sm font-medium text-slate-700
              transition hover:bg-slate-200
            "
          >
            Переглянути користувача
          </button>
        </div>
      </section>

      {/* Photos */}
      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Фотографії
          </h2>

          <span className="text-sm text-slate-500">
            {housing.photos.length}
          </span>
        </div>

        {housing.photos.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            Фотографій немає.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {housing.photos.map((photo) => (
              <div
                key={photo.id}
                className="relative overflow-hidden rounded-xl bg-slate-100"
              >
                <img
                  src={getMediaUrl(photo.filePath)}
                  alt={housing.title}
                  className="aspect-[4/3] w-full object-cover"
                />

                {photo.isMain && (
                  <span
                    className="
                      absolute left-3 top-3 rounded-full
                      bg-white px-2.5 py-1 text-xs
                      font-medium text-slate-700 shadow-sm
                    "
                  >
                    Головне фото
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminHousingDetailsPage;