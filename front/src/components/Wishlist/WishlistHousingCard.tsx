import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { getMediaUrl } from "../../api/client";
import { useCurrency } from "../../hooks/useCurrency";
import useLocalizedPath from "../../hooks/useLocalizedPath";

import type { Housing } from "../../types/housing";

interface Props {
  housing: Housing;
  onRemove: () => void;
}

const WishlistHousingCard = ({
  housing,
  onRemove,
}: Props) => {
  const { i18n } = useTranslation();
  const { convert, currency } = useCurrency();
  const localizedPath = useLocalizedPath();

  const price = convert(
    housing.pricePerNight
  ).toLocaleString(i18n.language);

  const rating = housing.averageRating ?? 0;

  return (
    <Link
      to={localizedPath(`/housing/${housing.id}`)}
      className="group block w-full max-w-[212px]"
    >
      <article>
        {/* Фото житла */}
        <div className="relative h-[200px] w-full overflow-hidden rounded-xl bg-slate-200">
          {housing.mainPhotoPath ? (
            <img
              src={getMediaUrl(housing.mainPhotoPath)}
              alt={housing.title}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <img
                src="/images/logos/Logo_WayGo.png"
                alt="WayGo"
                className="h-8 w-auto"
              />
            </div>
          )}

          {/* Видалення житла зі списку */}
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onRemove();
            }}
            aria-label="Видалити зі списку"
            className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80"
          >
            <img
              src="/images/icons/close.svg"
              alt=""
              className="h-5 w-5"
            />
          </button>
        </div>

        {/* Інформація */}
        <div className="pt-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-base font-medium text-slate-900">
              {housing.title}
            </h3>

            {/* Реальний рейтинг */}
            {housing.reviewCount > 0 && (
              <span className="shrink-0 text-sm text-amber-400">
                ★ {rating.toFixed(1)}
              </span>
            )}
          </div>

          <p className="mt-0.5 text-xs text-slate-500">
            {housing.city}
          </p>

          {/* Ціна в поточній валюті */}
          <p className="mt-2 text-sm font-medium text-slate-900">
            {currency.toUpperCase()} {price}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default WishlistHousingCard;