import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { destinationApi } from "../../api/api";
import { getMediaUrl } from "../../api/client";
import type { Destination } from "../../types/destination";

interface Props {
  onDestinationSelect: (destination: Destination) => void;
}

/**
 * Секція "Популярні напрямки" з дизайну Figma: два великих банери
 * в ряд (фото на весь блок, назва міста знизу). На відміну від
 * PopularDestinations.tsx (маленький список у дропдауні пошуку),
 * тут — великий візуальний блок на самій сторінці.
 *
 * Клік по картці фільтрує основний список житла нижче по місту
 * цього напрямку (той самий механізм, що і вибір із пошукового
 * дропдауна) — окремої сторінки "напрямку" в застосунку немає.
 *
 * ПРИМІТКА: у макеті Figma на банері є іконка серця. У поточній
 * моделі даних немає концепції "улюблені напрямки" (є лише
 * wishlist для об'єктів житла), тому іконка тут суто декоративна
 * і не зберігає стан. Для реального функціоналу "зберегти
 * напрямок" знадобиться окрема модель на бекенді.
 */
const PopularDestinationsSection = ({ onDestinationSelect }: Props) => {
  const { t } = useTranslation();

  const { data: destinations = [], isLoading } = useQuery<Destination[]>({
    queryKey: ["popular-destinations"],
    queryFn: destinationApi.getPopular,
  });

  const topTwo = destinations.slice(0, 2);

  if (!isLoading && topTwo.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1380px] px-6 py-10">
      <div className="mb-7 flex flex-col gap-3">
        <h2 className="text-[32px] font-semibold leading-tight text-black min-[1500px]:text-[50px] min-[1500px]:leading-[63px]">
          {t("home.popularDestinations.title", "Популярні напрямки")}
        </h2>
        <p className="text-base font-medium text-[#414141] min-[1500px]:text-xl">
          {t("home.popularDestinations.subtitle", "Куди найчастіше подорожують з України")}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 min-[1024px]:grid-cols-2">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="h-[488px] animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6 min-[1024px]:flex-row">
          {topTwo.map((destination) => {
            const cityName = t(`destinations.cities.${destination.slug}`, {
              defaultValue: destination.city,
            });

            return (
              <button
                key={destination.id}
                type="button"
                onClick={() => onDestinationSelect(destination)}
                className="group relative h-[488px] w-full overflow-hidden rounded-[20px] bg-slate-300 text-left"
              >
                {destination.imagePath && (
                  <img
                    src={getMediaUrl(destination.imagePath)}
                    alt={cityName}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-black/20 px-5 py-6">
                  <h3 className="text-2xl font-bold text-white min-[1500px]:text-[30px]">
                    {cityName}
                  </h3>

                  <span className="flex h-[66px] w-[66px] shrink-0 items-center justify-center text-[32px] leading-none text-white">
                    ♡
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default PopularDestinationsSection;
