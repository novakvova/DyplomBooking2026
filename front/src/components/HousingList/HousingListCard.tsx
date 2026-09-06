import { useState } from "react";

import { getMediaUrl } from "../../api/client";
import { useCurrency } from "../../hooks/useCurrency";
import {
  getAmenities,
  getRating,
  getReviewCount,
} from "./housingList.utils";
import type { HousingListItem } from "./housingList.types";

interface HousingListCardProps {
  housing: HousingListItem;
  onOpen: () => void;
}

const HousingListCard = ({
  housing,
  onOpen,
}: HousingListCardProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const { convert, currencyCode } = useCurrency();

  const image = getMediaUrl(housing.mainPhotoPath);
  const rating = getRating(housing);
  const reviews = getReviewCount(housing);
  const amenities = getAmenities(housing);

  const price = convert(Number(housing.pricePerNight ?? 0));

  const normalizedRating = rating > 5 ? rating / 2 : rating;
  const roundedRating = Math.round(normalizedRating * 10) / 10;
  const filledStars = Math.round(normalizedRating);

  return (
    <article className="overflow-hidden rounded-[16px] border border-[#6D7B85] bg-white transition hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] md:grid md:min-h-[260px] md:grid-cols-[44%_56%]">
      <button
        type="button"
        onClick={onOpen}
        className="block h-[250px] w-full overflow-hidden bg-slate-100 md:h-full"
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

      <div className="flex min-w-0 flex-col p-6">
        <button
          type="button"
          onClick={onOpen}
          className="text-left text-[27px] font-medium leading-tight text-[#101820] transition hover:text-[#355F7D]"
        >
          {housing.title}
        </button>

        {(housing.city || housing.address) && (
          <div className="mt-2 flex items-center gap-1.5 text-[13px] text-[#355F7D]">
            <LocationIcon />
            <span className="truncate">
              {[housing.city, housing.address].filter(Boolean).join(", ")}
            </span>
          </div>
        )}

        <div className="mt-5">
          <p className="mb-2 text-[14px] font-semibold text-[#202A31]">
            {String(housing.type ?? "")}
          </p>

          {amenities.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[13px] text-[#333D44]">
              {amenities.slice(0, 6).map((amenity) => (
                <span key={amenity}>• {amenity}</span>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-[#333D44]">
              <span>• Кімнат: {housing.rooms}</span>
              <span>• До {housing.maxGuests} гостей</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[25px] font-bold leading-none text-[#253C4D]">
                {new Intl.NumberFormat("uk-UA").format(price)} {currencyCode}
              </div>
              <div className="mt-1 text-[12px] text-slate-500">за ніч</div>
            </div>

            <RatingBlock
              rating={roundedRating}
              reviews={reviews}
              filledStars={filledStars}
            />
          </div>

          <button
            type="button"
            onClick={onOpen}
            className="mt-4 h-[48px] w-full rounded-[7px] bg-[#355F7D] text-[14px] font-semibold text-white transition hover:bg-[#294E68]"
          >
            Бронюй
          </button>
        </div>
      </div>
    </article>
  );
};

const RatingBlock = ({
  rating,
  reviews,
  filledStars,
}: {
  rating: number;
  reviews: number;
  filledStars: number;
}) => {
  if (reviews <= 0 || rating <= 0) {
    return (
      <div className="text-right text-[12px] text-slate-400">
        Ще немає відгуків
      </div>
    );
  }

  return (
    <div className="text-right">
      <div className="flex items-center justify-end gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon key={star} active={star <= filledStars} />
        ))}
      </div>

      <div className="mt-1 text-[12px] text-slate-500">
        <span className="font-semibold text-[#253C4D]">
          {rating.toFixed(1)}
        </span>
        {" · "}
        {reviews} {getReviewLabel(reviews)}
      </div>
    </div>
  );
};

const getReviewLabel = (count: number) => {
  const lastTwo = count % 100;
  const last = count % 10;

  if (lastTwo >= 11 && lastTwo <= 14) return "відгуків";
  if (last === 1) return "відгук";
  if (last >= 2 && last <= 4) return "відгуки";
  return "відгуків";
};

const LocationIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const StarIcon = ({ active }: { active: boolean }) => (
  <svg
    width="23"
    height="23"
    viewBox="0 0 24 24"
    fill={active ? "#FFB341" : "none"}
    stroke="#FFB341"
    strokeWidth="1.5"
  >
    <path d="m12 2.8 2.8 5.7 6.3.9-4.5 4.4 1 6.2-5.6-3-5.6 3 1-6.2-4.5-4.4 6.3-.9L12 2.8Z" />
  </svg>
);

export default HousingListCard;
