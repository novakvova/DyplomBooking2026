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
import StarRating from "./StarRating";
import LikeButton from "./LikeButton";

import type { Housing } from "../../types/housing";

interface Props {
  housing: Housing;
  isFavorite?: boolean;
  discountPercent?: number;
}

/**
 * Картка житла для маркетингових секцій головної сторінки
 * (Гарячі знижки / Найкращі готелі сезону / Подорожі будь-якого
 * типу), стилізована згідно дизайну Figma.
 *
 * Ширина картки розрахована так, щоб рівно 4 картки поміщались в
 * ряд на контейнері шириною ~1383px при gap 24px:
 * (1383 - 3*24) / 4 ≈ 310px — звідси max-w-[310px] замість
 * попереднього 327px, який залишав місце лише для трьох.
 *
 * Назва й зірки рейтингу розташовані одна під одною (а не в один
 * рядок), щоб довгі назви житла не обрізались через тісноту з
 * рейтингом праворуч.
 */
const HomeSectionCard = ({ housing, isFavorite = false, discountPercent }: Props) => {
  const { t, i18n } = useTranslation();
  const localizedPath = useLocalizedPath();
  const { convert, currency } = useCurrency();
  const queryClient = useQueryClient();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [authOpen, setAuthOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [liked, setLiked] = useState(isFavorite);

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

    if (liked) {
      setLiked(false);
      removeMutation.mutate();
    } else {
      setLiked(true);
      setWishlistOpen(true);
    }
  };

  const price = convert(housing.pricePerNight).toLocaleString(i18n.language);

  return (
    <>
      <Link
        to={localizedPath(`/housing/${housing.id}`)}
        className="group flex w-full flex-col gap-4"
      >
        <div className="relative h-[280px] w-full overflow-hidden rounded-[20px] bg-gradient-to-br from-slate-200 to-slate-300 transition-shadow duration-300 group-hover:shadow-xl">
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

          <LikeButton
            isFavorite={liked}
            onToggle={handleWishlist}
            disabled={addMutation.isPending || removeMutation.isPending}
            ariaLabel={
              liked
                ? t("housingCard.wishlist.remove")
                : t("housingCard.wishlist.add")
            }
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <h3 className="line-clamp-1 text-lg font-medium leading-[1.25] text-black transition-colors group-hover:text-[#4B9DA9] min-[1500px]:text-2xl">
              {housing.title}
            </h3>

            <StarRating rating={housing.averageRating || 5} size={16} />

            <p className="text-[15px] font-medium text-[#414141] min-[1500px]:text-[17px]">
              {housing.city}
            </p>
          </div>

          <div className="flex items-center justify-start">
            <span className="flex h-10 items-center justify-center rounded-[10px] bg-[#4B9DA9] px-3 text-lg font-medium text-white transition-colors group-hover:bg-[#3d838d]">
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
