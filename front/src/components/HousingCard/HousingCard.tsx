import { Link } from "react-router-dom";
import type { MouseEvent } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { wishlistApi } from "../../api/api";
import type { Housing } from "../../types/housing";
import { useCurrency } from "../../hooks/useCurrency";


interface Props {
  housing: Housing;
  isFavorite?: boolean;
}


const typeLabels: Record<string, string> = {
  Apartment: "Квартира",
  House: "Будинок",
  Room: "Кімната",
  Studio: "Студія",
  Villa: "Вілла",
};


const HousingCard = ({
  housing,
  isFavorite = false,
}: Props) => {

  const { convert, currency } = useCurrency();
  const queryClient = useQueryClient();


  const addMutation = useMutation({
    mutationFn: () => wishlistApi.add(housing.id),

    onSuccess: () => {
      queryClient.setQueryData<Housing[]>(
        ["wishlist"],
        (old = []) => {
          if (old.some((item) => item.id === housing.id)) {
            return old;
          }

          return [...old, housing];
        }
      );
    },
  });


  const removeMutation = useMutation({
    mutationFn: () => wishlistApi.remove(housing.id),

    onSuccess: () => {
      queryClient.setQueryData<Housing[]>(
        ["wishlist"],
        (old = []) =>
          old.filter(
            (item) => item.id !== housing.id
          )
      );
    },
  });


  const handleWishlist = (
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      addMutation.isPending ||
      removeMutation.isPending
    ) {
      return;
    }

    if (isFavorite) {
      removeMutation.mutate();
    } else {
      addMutation.mutate();
    }
  };


  return (
    <Link
      to={`/housing/${housing.id}`}
      className="
        group
        block
        overflow-hidden
        rounded-2xl
        bg-white
        shadow-sm
        transition-shadow
        duration-200
        hover:shadow-md
      "
    >

      {/* Photo */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">

        {housing.mainPhotoPath ? (
          <img
            src={housing.mainPhotoPath}
            alt={housing.title}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-300
              group-hover:scale-105
            "
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


        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={
            addMutation.isPending ||
            removeMutation.isPending
          }
          className="
            absolute
            right-3
            top-3
            z-20
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-md
            transition
            hover:scale-105
            disabled:opacity-60
          "
        >
          <span
            className={`
              text-[24px]
              leading-none
              ${
                isFavorite
                  ? "text-red-500"
                  : "text-slate-800"
              }
            `}
          >
            {isFavorite ? "♥" : "♡"}
          </span>
        </button>

        {/* Type */}
        <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow">
          {typeLabels[housing.type] ?? housing.type}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">

        <h3 className="line-clamp-1 font-semibold text-slate-800 group-hover:text-slate-600">
          {housing.title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          📍 {housing.city}, {housing.address}
        </p>

        <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
          <span>🛏 {housing.rooms} кімн.</span>
          <span>👥 до {housing.maxGuests} гостей</span>
        </div>

        <div className="mt-3 flex items-center justify-between">

          <span className="font-semibold text-slate-800">

            {convert(
              housing.pricePerNight
            ).toLocaleString()}{" "}

            {currency.toUpperCase()}

            <span className="text-xs font-normal text-slate-400">
              {" "} / ніч
            </span>

          </span>

          <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-medium text-white">
            Переглянути
          </span>
        </div>
      </div>
    </Link>
  );
};


export default HousingCard;