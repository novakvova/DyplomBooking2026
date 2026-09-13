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
import AuthModal from "../AuthModal/AuthModal";

import type { Housing } from "../../types/housing";

interface Props {
  housing: Housing;
  isFavorite?: boolean;
  // Показати бейдж відсотка знижки поверх фото (секція "Гарячі знижки").
  discountPercent?: number;
}

/**
 * Картка житла для маркетингових секцій головної сторінки
 * (Гарячі знижки / Найкращі готелі сезону / Подорожі будь-якого
 * типу), стилізована згідно дизайну Figma: зірковий рейтинг,
 * бірюзовий бейдж ціни, кругла кнопка wishlist поверх фото.
 *
 * Це окремий компонент від HousingCard (каталог/список), бо
 * розмітка і акценти тут інші (зірки замість типу нерухомості,
 * ціна в бейджі замість підпису знизу) — переписувати HousingCard
 * під обидва стилі зробило б його складнішим для підтримки.
 * Логіка wishlist навмисно продубльована в спрощеному вигляді
 * (без папок при видаленні — тут завжди просте додавання/видалення
 * "в улюблені"), щоб не тягнути повний набір модалок папок на
 * головну сторінку.
 */
const HomeSectionCard = ({ housing, isFavorite = false, discountPercent }: Props) => {
  const { t, i18n } = useTranslation();
  const localizedPath = useLocalizedPath();
  const { convert, currency } = useCurrency();
  const queryClient = useQueryClient();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [authOpen, setAuthOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const addMutation = useMutation({
    mutationFn: (folderIds: number[]) => wishlistApi.add(housing.id, folderIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-folders"] });
    },
    onError: () => toast.error(t("housingCard.wishlist.error")),
  });

  const removeMutation = useMutation({
    mutationFn: () => wishlistApi.remove(housing.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-folders"] });
    },
    onError: () => toast.error(t("housingCard.wishlist.error")),
  });

  const handleWishlist = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }

    if (addMutation.isPending || removeMutation.isPending) return;

    if (isFavorite) {
      removeMutation.mutate();
    } else {
      setWishlistOpen(true);
    }
  };

  const price = convert(housing.pricePerNight).toLocaleString(i18n.language);
  const rating = Math.round(housing.averageRating || 5);

  return (
    <>
      <Link
        to={localizedPath(`/housing/${housing.id}`)}
        className="group flex w-full max-w-[327px] flex-col gap-4"
      >
        {/* Фото */}
        <div className="relative h-[280px] w-full overflow-hidden rounded-[20px] bg-gradient-to-br from-slate-200 to-slate-300">
          {housing.mainPhotoPath ? (
            <img
              src={getMediaUrl(housing.mainPhotoPath)}
              alt={housing.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/images/logos/Logo_WayGo.png" alt="WayGo" className="h-8 w-auto" />
            </div>
          )}

          {typeof discountPercent === "number" && discountPercent > 0 && (
            <div className="absolute left-4 top-4 rounded-[10px] bg-[#EA4335] px-3 py-1.5 text-sm font-semibold text-white">
              -{discountPercent}%
            </div>
          )}

          <button
            type="button"
            onClick={handleWishlist}
            disabled={addMutation.isPending || removeMutation.isPending}
            aria-label={
              isFavorite
                ? t("housingCard.wishlist.remove")
                : t("housingCard.wishlist.add")
            }
            className="absolute right-4 top-4 flex h-[46px] w-[46px] items-center justify-center rounded-[20px] bg-white/10 backdrop-blur-sm disabled:opacity-60"
          >
            <span
              className={`text-[22px] leading-none ${
                isFavorite ? "text-red-500" : "text-white"
              }`}
            >
              {isFavorite ? "♥" : "♡"}
            </span>
          </button>
        </div>

        {/* Інфо */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-6">
              <h3 className="line-clamp-1 text-[22px] font-medium leading-[1.25] text-black min-[1500px]:text-[30px]">
                {housing.title}
              </h3>

              <div className="flex shrink-0 items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className={index < rating ? "text-[#FFC14D]" : "text-slate-200"}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <p className="text-[15px] font-medium text-[#414141] min-[1500px]:text-[17px]">
              {housing.city}
            </p>
          </div>

          <div className="flex items-center justify-start">
            <span className="flex h-10 items-center justify-center rounded-[10px] bg-[#4B9DA9] px-3 text-lg font-medium text-white">
              {currency.toUpperCase()} {price}
            </span>
          </div>
        </div>
      </Link>

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

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default HomeSectionCard;
