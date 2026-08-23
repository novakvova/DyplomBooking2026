import { useTranslation } from "react-i18next";

import type { Destination } from "../../types/destination";
import { getMediaUrl } from "../../api/client";

interface DestinationDropdownProps {
  destinations: Destination[];
  recent?: Destination[];
  onSelect: (destination: Destination) => void;
}

const DestinationDropdown = ({
  destinations,
  recent = [],
  onSelect,
}: DestinationDropdownProps) => {
  const { t, i18n } = useTranslation();

  // Локалізація назв країн через ISO-код.
  const countryNames = new Intl.DisplayNames([i18n.language], {
    type: "region",
  });

  const getCountryName = (destination: Destination) => {
    if (!destination.countryCode) return destination.country;

    return (
      countryNames.of(destination.countryCode.toUpperCase()) ??
      destination.country
    );
  };

  // Назву міста беремо з i18n через стабільний slug.
  const getCityName = (destination: Destination) =>
    t(`destinations.cities.${destination.slug}`, {
      defaultValue: destination.city,
    });

  // Опис теж локалізуємо через slug.
  const getDescription = (destination: Destination) =>
    t(`destinations.descriptions.${destination.slug}`, {
      defaultValue: destination.description,
    });

  const renderDestination = (
    item: Destination,
    keyPrefix: string
  ) => {
    const cityName = getCityName(item);
    const countryName = getCountryName(item);
    const description = getDescription(item);

    return (
      <button
        key={`${keyPrefix}-${item.id}`}
        type="button"
        onClick={() => onSelect(item)}
        className="flex w-full items-center gap-4 rounded-xl p-2 text-left transition hover:bg-slate-100"
      >
        {item.imagePath && (
          <img
            src={getMediaUrl(item.imagePath)}
            alt={`${cityName}, ${countryName}`}
            className="h-20 w-20 shrink-0 rounded-lg object-cover"
          />
        )}

        <div className="min-w-0">
          <h3 className="text-lg font-bold">
            {cityName}, {countryName}
          </h3>

          <p className="text-sm text-slate-600">
            {description}
          </p>
        </div>
      </button>
    );
  };

  return (
    <div className="absolute left-0 top-full z-[2000] mt-3 max-h-[520px] w-[607px] overflow-y-auto rounded-2xl bg-white p-5 text-slate-900 shadow-xl">
      {/* Нещодавні напрямки */}
      {recent.length > 0 && (
        <>
          <h2 className="mb-5 text-xl font-bold">
            {t("destinationDropdown.recent")}
          </h2>

          <div className="mb-6 space-y-2">
            {recent.map((item) =>
              renderDestination(item, "recent")
            )}
          </div>
        </>
      )}

      {/* Популярні напрямки / результати пошуку */}
      <h2 className="mb-5 text-xl font-bold">
        {t("destinationDropdown.popular")}
      </h2>

      {destinations.length === 0 && (
        <p className="py-5 text-center text-slate-500">
          {t("common.notFound")}
        </p>
      )}

      <div className="space-y-2">
        {destinations.map((item) =>
          renderDestination(item, "destination")
        )}
      </div>
    </div>
  );
};

export default DestinationDropdown;