import { useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { wishlistApi } from "../../api/api";
import { getMediaUrl } from "../../api/client";
import { useAuthStore } from "../../store/authStore";
import { useCurrency } from "../../hooks/useCurrency";
import useLocalizedPath from "../../hooks/useLocalizedPath";

import WishlistModal from "../Wishlist/WishlistModal";
import RemoveWishlistItemModal from "../Wishlist/RemoveWishlistItemModal";
import AuthModal from "../AuthModal/AuthModal";

import type { Housing } from "../../types/housing";

interface Props {
  housing: Housing;
  isFavorite?: boolean;
  wishlistFolderId?: number;
}

const HousingCard = ({
  housing,
  isFavorite = false,
  wishlistFolderId,
}: Props) => {
  const { t, i18n } = useTranslation();
  const localizedPath = useLocalizedPath();
  const { convert, currency } = useCurrency();
  const queryClient = useQueryClient();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isWishlistPage = wishlistFolderId !== undefined;

  const [authOpen, setAuthOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  // Додаємо житло в одну або декілька папок.
  const addMutation = useMutation({
    mutationFn: (folderIds: number[]) => wishlistApi.add(housing.id, folderIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-folders"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-folder"] });
    },
    onError: () => toast.error(t("housingCard.wishlist.error")),
  });

  // Повністю видаляємо житло з усіх списків.
  const removeAllMutation = useMutation({
    mutationFn: () => wishlistApi.remove(housing.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-folders"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-folder"] });
    },
    onError: () => toast.error(t("housingCard.wishlist.error")),
  });

  // Видаляємо житло тільки з поточної папки.
  const removeFromFolderMutation = useMutation({
    mutationFn: () => wishlistApi.removeFromFolder(wishlistFolderId!, housing.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist-folder", wishlistFolderId] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-folders"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      setRemoveOpen(false);
    },
    onError: () => toast.error(t("housingCard.wishlist.error")),
  });

  // Обробка wishlist-кнопки.
  const handleWishlist = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }

    if (
      addMutation.isPending ||
      removeAllMutation.isPending ||
      removeFromFolderMutation.isPending
    ) return;

    // Усередині папки close.svg відкриває підтвердження.
    if (isWishlistPage) {
      setRemoveOpen(true);
      return;
    }

    // У каталозі ♥ видаляє житло повністю.
    if (isFavorite) {
      removeAllMutation.mutate();
      return;
    }

    // У каталозі ♡ відкриває вибір папок.
    setWishlistOpen(true);
  };

  const price = convert(housing.pricePerNight).toLocaleString(i18n.language);

  return (
    <>
      <Link
        to={localizedPath(`/housing/${housing.id}`)}
        className="group block overflow-hidden rounded-2xl bg-white"
      >
        {/* Фото */}
        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
          {housing.mainPhotoPath ? (
            <img
              src={getMediaUrl(housing.mainPhotoPath)}
              alt={housing.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/images/logos/Logo_WayGo.png"
                alt="WayGo"
                className="h-8 w-auto"
              />
            </div>
          )}

          {/* Wishlist / видалення */}
          <button
            type="button"
            onClick={handleWishlist}
            disabled={
              addMutation.isPending ||
              removeAllMutation.isPending ||
              removeFromFolderMutation.isPending
            }
            aria-label={
              isWishlistPage
                ? "Видалити з цього списку"
                : isFavorite
                  ? t("housingCard.wishlist.remove")
                  : t("housingCard.wishlist.add")
            }
            className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center p-0 disabled:opacity-60"
          >
            {isWishlistPage ? (
              <img
                src="/images/icons/close.svg"
                alt="Видалити"
                className="h-[29px] w-[29px] object-contain"
              />
            ) : (
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-white text-[24px] leading-none ${
                  isFavorite ? "text-red-500" : "text-slate-800"
                }`}
              >
                {isFavorite ? "♥" : "♡"}
              </span>
            )}
          </button>

          {/* Тип житла */}
          <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
            {t(`housing.types.${housing.type}`, {
              defaultValue: housing.type,
            })}
          </div>
        </div>

        {/* Інформація */}
        <div className="p-4">
          <h3 className="line-clamp-1 font-semibold text-slate-800 group-hover:text-slate-600">
            {housing.title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            📍 {housing.city}, {housing.address}
          </p>

          <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
            <span>
              🛏 {t("housingCard.rooms", { count: housing.rooms })}
            </span>
            <span>
              👥 {t("housingCard.guests", { count: housing.maxGuests })}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="font-semibold text-slate-800">
              {price} {currency.toUpperCase()}
              <span className="text-xs font-normal text-slate-400">
                {" "}{t("housingCard.perNight")}
              </span>
            </span>
          </div>
        </div>
      </Link>

      {/* Вибір папок при додаванні */}
      {wishlistOpen && (
        <WishlistModal
          open
          onClose={() => setWishlistOpen(false)}
          onSave={(folderIds) => {
            addMutation.mutate(folderIds);
            setWishlistOpen(false);
          }}
        />
      )}

      {/* Підтвердження видалення з конкретної папки */}
      <RemoveWishlistItemModal
        open={removeOpen}
        housingTitle={housing.title}
        isPending={removeFromFolderMutation.isPending}
        onClose={() => setRemoveOpen(false)}
        onConfirm={() => removeFromFolderMutation.mutate()}
      />

      {/* Авторизація */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />
    </>
  );
};

export default HousingCard;
