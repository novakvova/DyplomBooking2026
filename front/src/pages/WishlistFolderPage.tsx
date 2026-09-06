import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useWishlistFolder } from "../hooks/useWishlistFolder";
import { wishlistFolderApi } from "../api/wishlistFolderApi";
import useLocalizedPath from "../hooks/useLocalizedPath";

import WishlistHousingCard from "../components/Wishlist/WishlistHousingCard";
import RemoveWishlistItemModal from "../components/Wishlist/RemoveWishlistItemModal";

const WishlistFolderPage = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const localizedPath = useLocalizedPath();
  const queryClient = useQueryClient();

  const id = Number(folderId);

  const { folder, isLoading, error } = useWishlistFolder(id);

  // ID житла, яке користувач хоче видалити.
  const [removeHousing, setRemoveHousing] = useState<{
    id: number;
    title: string;
  } | null>(null);

  // Видалення житла тільки з поточної папки.
  const removeMutation = useMutation({
    mutationFn: (housingId: number) =>
      wishlistFolderApi.removeItem(id, housingId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist-folder", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["wishlist-folders"],
      });

      setRemoveHousing(null);

      toast.success("Помешкання видалено зі списку.");
    },

    onError: () => {
      toast.error("Не вдалося видалити помешкання.");
    },
  });

  // Завантаження.
  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <p className="text-sm text-slate-500">Завантаження...</p>
        </div>
      </main>
    );
  }

  // Помилка або папку не знайдено.
  if (error || !folder) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Link
            to={localizedPath("/wishlist")}
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            ← Назад до списків
          </Link>

          <p className="mt-8 text-red-500">
            Не вдалося завантажити список.
          </p>
        </div>
      </main>
    );
  }

  const items = folder.items;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Повернення до списків */}
        <Link
          to={localizedPath("/wishlist")}
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          ← Назад до списків
        </Link>

        {/* Назва списку */}
        <h1 className="mt-5 text-3xl font-semibold text-slate-900">
          {folder.name}
        </h1>

        {/* Порожній список */}
        {items.length === 0 && (
          <div className="flex min-h-[450px] flex-col items-center justify-center text-center">
            <img
              src="/images/items/empty_wishlist_2.png"
              alt="Порожня папка"
              className="h-40 w-40 rounded-xl object-cover"
            />

            <h2 className="mt-4 text-xl font-semibold text-slate-800">
              Поки що тут порожньо
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Додавайте улюблене те, що вам сподобалось
            </p>

            <Link
              to={localizedPath("/housing")}
              className="mt-5 rounded-lg bg-[#355872] px-10 py-2.5 text-sm font-medium text-white transition hover:bg-[#29475c]"
            >
              Знайти житло
            </Link>
          </div>
        )}

        {/* Житла всередині списку */}
        {items.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
            {items.map((housing) => (
              <WishlistHousingCard
                key={housing.id}
                housing={housing}
                onRemove={() =>
                  setRemoveHousing({
                    id: housing.id,
                    title: housing.title,
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Підтвердження видалення */}
      <RemoveWishlistItemModal
        open={removeHousing !== null}
        housingTitle={removeHousing?.title ?? ""}
        isPending={removeMutation.isPending}
        onClose={() => setRemoveHousing(null)}
        onConfirm={() => {
          if (removeHousing) {
            removeMutation.mutate(removeHousing.id);
          }
        }}
      />
    </main>
  );
};

export default WishlistFolderPage;