import { useTranslation } from "react-i18next";

import { getMediaUrl } from "../../api/client";
import type { Destination } from "../../types/destination";

interface Props {
  destination: Destination;
  onClick?: () => void;
}

const DestinationCard = ({ destination, onClick }: Props) => {
  const { t, i18n } = useTranslation();

  const cityName = t(`destinations.cities.${destination.slug}`, {
    defaultValue: destination.city,
  });

  const countryNames = new Intl.DisplayNames([i18n.language], {
    type: "region",
  });

  const countryName = destination.countryCode
    ? countryNames.of(destination.countryCode.toUpperCase()) ?? destination.country
    : destination.country;

  const description = t(`destinations.descriptions.${destination.slug}`, {
    defaultValue: destination.description,
  });

  const imageUrl = getMediaUrl(destination.imagePath);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-4 rounded-xl p-2 text-left transition hover:bg-gray-50"
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`${cityName}, ${countryName}`}
          className="h-16 w-16 shrink-0 rounded-xl object-cover"
        />
      )}

      <div className="min-w-0">
        <h3 className="text-lg font-bold">
          {cityName}, {countryName}
        </h3>

        <p className="text-sm text-gray-600">
          {description}
        </p>
      </div>
    </button>
  );
};

export default DestinationCard;