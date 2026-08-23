import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Image, Save, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getMediaUrl } from "../../../api/client";
import { adminDestinationsApi } from "../../../api/adminApi";
import type { AdminDestinationRequest } from "../../types/destination";

const initialForm: AdminDestinationRequest = {
  slug: "",
  countryCode: "",
  city: "",
  country: "",
  imagePath: "",
  description: "",
  isPopular: false,
};

const AdminDestinationFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<AdminDestinationRequest>(initialForm);
  const [isDragging, setIsDragging] = useState(false);

  const destinationId = id ? Number(id) : null;
  const isEdit = destinationId !== null && Number.isFinite(destinationId);

  // ─────────────────────────────────────────────
  // FORM
  // ─────────────────────────────────────────────

  const updateField = <K extends keyof AdminDestinationRequest>(
    key: K,
    value: AdminDestinationRequest[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  // ─────────────────────────────────────────────
  // IMAGE UPLOAD
  // ─────────────────────────────────────────────

  const uploadMutation = useMutation({
    mutationFn: (file: File) =>
      adminDestinationsApi.uploadImage(
        file,
        form.slug
      ),

    onSuccess: ({ imagePath }) => {
      updateField("imagePath", imagePath);
      toast.success("Зображення завантажено.");
    },

    onError: (error: any) => {
      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : "Не вдалося завантажити зображення.";

      toast.error(message);
    },
  });

  const handleFile = (file?: File) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Дозволені формати: JPG, PNG, WEBP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Максимальний розмір файлу — 5 MB.");
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  // ─────────────────────────────────────────────
  // DESTINATION
  // ─────────────────────────────────────────────

  const {
    data: destination,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-destination", destinationId],
    queryFn: () => adminDestinationsApi.getById(destinationId!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (!destination) return;

    setForm({
      slug: destination.slug,
      countryCode: destination.countryCode,
      city: destination.city,
      country: destination.country,
      imagePath: getMediaUrl(destination.imagePath),
      description: destination.description,
      isPopular: destination.isPopular,
    });
  }, [destination]);

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: adminDestinationsApi.create,

    onSuccess: async () => {
      toast.success("Напрямок створено.");
      await queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
      navigate("/admin/destinations");
    },

    onError: (error: any) => {
      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : "Не вдалося створити напрямок.";

      toast.error(message);
    },
  });

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────

  const updateMutation = useMutation({
    mutationFn: (dto: AdminDestinationRequest) =>
      adminDestinationsApi.update(destinationId!, dto),

    onSuccess: async () => {
      toast.success("Напрямок оновлено.");

      await queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
      await queryClient.invalidateQueries({
        queryKey: ["admin-destination", destinationId],
      });

      navigate("/admin/destinations");
    },

    onError: (error: any) => {
      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : "Не вдалося оновити напрямок.";

      toast.error(message);
    },
  });

  // ─────────────────────────────────────────────
  // SUBMIT
  // ─────────────────────────────────────────────

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.city.trim() || !form.country.trim() || !form.slug.trim()) {
      toast.error("Заповніть місто, країну та slug.");
      return;
    }

    if (uploadMutation.isPending) {
      toast.error("Дочекайтеся завершення завантаження зображення.");
      return;
    }

    if (isEdit) updateMutation.mutate(form);
    else createMutation.mutate(form);
  };

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadMutation.isPending;

  // ─────────────────────────────────────────────
  // STATES
  // ─────────────────────────────────────────────

  if (isEdit && isLoading) {
    return <div className="p-8 text-center text-slate-500">Завантаження...</div>;
  }

  if (isEdit && error) {
    return (
      <div className="p-8 text-center text-red-600">
        Не вдалося завантажити напрямок.
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <div className="p-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/admin/destinations")}
        className="mb-5 flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
      >
        <ArrowLeft size={18} />
        До напрямків
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {isEdit ? "Редагування напрямку" : "Новий напрямок"}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {isEdit
            ? "Змініть інформацію про напрямок"
            : "Додайте новий напрямок WayGo"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 xl:grid-cols-[1fr_380px]"
      >
        {/* Main */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* City */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Місто *
              </label>

              <input
                type="text"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="Kyiv"
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
              />
            </div>

            {/* Country */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Країна *
              </label>

              <input
                type="text"
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                placeholder="Ukraine"
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Slug *
              </label>

              <input
                type="text"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="kyiv"
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Використовується як стабільний ключ для URL та перекладів.
              </p>
            </div>

            {/* ISO */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                ISO-код країни
              </label>

              <input
                type="text"
                maxLength={2}
                value={form.countryCode}
                onChange={(e) =>
                  updateField("countryCode", e.target.value.toUpperCase())
                }
                placeholder="UA"
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm uppercase outline-none transition focus:border-slate-400"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Опис
            </label>

            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Короткий опис напрямку..."
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
            />
          </div>

          {/* Image */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Зображення
            </label>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`flex min-h-[170px] flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition ${
                isDragging
                  ? "border-slate-500 bg-slate-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <Image size={32} className="text-slate-400" />

              <p className="mt-3 text-sm font-medium text-slate-700">
                Перетягніть зображення сюди
              </p>

              <p className="mt-1 text-xs text-slate-400">
                JPG, PNG, WEBP • до 5 MB
              </p>

              <label className="mt-4 cursor-pointer rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
                {uploadMutation.isPending ? "Завантаження..." : "Вибрати файл"}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={uploadMutation.isPending}
                  onChange={(e) => {
                    handleFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            {/* Uploaded image */}
            {form.imagePath && (
              <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <span className="truncate text-sm text-slate-500">
                  {form.imagePath}
                </span>

                <button
                  type="button"
                  onClick={() => updateField("imagePath", "")}
                  className="shrink-0 text-sm font-medium text-red-600"
                >
                  Прибрати
                </button>
              </div>
            )}
          </div>

          {/* Popular */}
          <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
            <input
              type="checkbox"
              checked={form.isPopular}
              onChange={(e) => updateField("isPopular", e.target.checked)}
              className="h-4 w-4"
            />

            <Star size={18} className="text-amber-500" />

            <div>
              <p className="text-sm font-medium text-slate-800">
                Популярний напрямок
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Відображати в блоці популярних напрямків.
              </p>
            </div>
          </label>

          {/* Submit */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />

              {uploadMutation.isPending
                ? "Завантаження фото..."
                : createMutation.isPending || updateMutation.isPending
                  ? "Збереження..."
                  : isEdit
                    ? "Зберегти зміни"
                    : "Створити напрямок"}
            </button>
          </div>
        </div>

        {/* Preview */}
        <aside>
          <div className="sticky top-6 rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">Попередній перегляд</h2>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <div className="h-48 bg-slate-100">
                {form.imagePath ? (
                  <img
                    src={getMediaUrl(form.imagePath)}
                    alt={form.city || "Destination"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <Image size={32} />
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900">
                      {form.city || "Місто"}
                      {form.country && `, ${form.country}`}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {form.description || "Опис напрямку"}
                    </p>
                  </div>

                  {form.isPopular && (
                    <Star size={18} className="shrink-0 text-amber-500" />
                  )}
                </div>

                <div className="mt-4 flex gap-2 text-xs text-slate-400">
                  {form.slug && <span>{form.slug}</span>}
                  {form.countryCode && <span>• {form.countryCode}</span>}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default AdminDestinationFormPage;