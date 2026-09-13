import { useState } from "react";

import { getMediaUrl } from "../../api/client";
import { useCurrency } from "../../hooks/useCurrency";
import {
  getRating,
  getReviewCount,
} from "./housingList.utils";
import type { HousingListItem } from "./housingList.types";

interface HousingGridCardProps {
  housing: HousingListItem;
  onOpen: () => void;
}

const HousingGridCard = ({
  housing,
  onOpen,
}: HousingGridCardProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const { convert, currencyCode } = useCurrency();

  const image = getMediaUrl(housing.mainPhotoPath);
  const rating = getRating(housing);
  const reviews = getReviewCount(housing);

  const normalizedRating =
    rating > 5 ? rating / 2 : rating;

  const roundedRating =
    Math.round(normalizedRating * 10) / 10;

  const filledStars = Math.round(normalizedRating);

  const price = convert(
    Number(housing.pricePerNight ?? 0)
  );

  return (
    <article className="overflow-hidden rounded-[16px] border border-[#6D7B85] bg-white transition hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
      <button
        type="button"
        onClick={onOpen}
        className="block h-[220px] w-full overflow-hidden bg-slate-100"
      >
        {image && !imageFailed ? (
          <img
            src={image}
            alt={housing.title}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
            Немає фото
          </div>
        )}
      </button>

      <div className="p-3">
        <button
          type="button"
          onClick={onOpen}
          className="block w-full truncate text-left text-[18px] font-medium text-[#101820] transition hover:text-[#355F7D]"
        >
          {housing.title}
        </button>

        {(housing.city || housing.address) && (
          <div className="mt-1 truncate text-[12px] text-[#355F7D]">
            {housing.city}
            {housing.address
              ? `, ${housing.address}`
              : ""}
          </div>
        )}

        <div className="mt-3 flex items-center gap-3 text-[12px] text-[#333D44]">
          <span>• Кімнат: {housing.rooms}</span>
          <span>• До {housing.maxGuests} гостей</span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            <div className="text-[20px] font-bold leading-none text-[#253C4D]">
              {new Intl.NumberFormat("uk-UA").format(
                price
              )}{" "}
              {currencyCode}
            </div>

            <div className="mt-1 text-[11px] text-slate-500">
              за ніч
            </div>
          </div>

          {reviews > 0 && roundedRating > 0 ? (
            <div className="text-right">
              <div className="flex items-center justify-end gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    active={star <= filledStars}
                  />
                ))}
              </div>

              <div className="mt-0.5 text-[11px] text-slate-500">
                {roundedRating.toFixed(1)} ·{" "}
                {reviews}{" "}
                {getReviewLabel(reviews)}
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400">
              Ще немає відгуків
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="mt-3 h-[42px] w-full rounded-[7px] bg-[#355F7D] text-[13px] font-semibold text-white transition hover:bg-[#294E68]"
        >
          Бронюй
        </button>
      </div>
    </article>
  );
};

const StarIcon = ({
  active,
}: {
  active: boolean;
}) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill={active ? "#FFB341" : "none"}
    stroke="#FFB341"
    strokeWidth="1.5"
  >
    <path d="m12 2.8 2.8 5.7 6.3.9-4.5 4.4 1 6.2-5.6-3-5.6 3 1-6.2-4.5-4.4 6.3-.9L12 2.8Z" />
  </svg>
);

const getReviewLabel = (count: number) => {
  const lastTwo = count % 100;
  const last = count % 10;

  if (lastTwo >= 11 && lastTwo <= 14) {
    return "відгуків";
  }

  if (last === 1) return "відгук";

  if (last >= 2 && last <= 4) {
    return "відгуки";
  }

  return "відгуків";
};

export default HousingGridCard;