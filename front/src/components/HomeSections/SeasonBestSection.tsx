import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { housingApi } from "../../api/api";
import type { Housing } from "../../types/housing";
import HomeSectionCard from "./HomeSectionCard";

interface Props {
  wishlist: Housing[];
}

/**
 * Секція "Найкращі готелі сезону" — нижній блок головної сторінки
 * з дизайну Figma. Дані з GET /api/housing/season-best (житло,
 * позначене IsSeasonBest=true).
 */
const SeasonBestSection = ({ wishlist }: Props) => {
  const { t } = useTranslation();

  const { data: housings = [], isLoading } = useQuery<Housing[]>({
    queryKey: ["housing", "season-best"],
    queryFn: () => housingApi.getSeasonBest(4),
  });

  if (!isLoading && housings.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1383px] px-6 py-10">
      <div className="mb-7 flex flex-col gap-3">
        <h2 className="text-[32px] font-semibold leading-tight text-black min-[1500px]:text-[50px] min-[1500px]:leading-[63px]">
          {t("home.seasonBest.title", "Найкращі готелі сезону")}
        </h2>
        <p className="text-base font-medium text-[#414141] min-[1500px]:text-xl">
          {t("home.seasonBest.subtitle", "Для тих хто хоче відпочити на всі 100%")}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-[395px] animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap items-end gap-6">
          {housings.map((housing) => (
            <HomeSectionCard
              key={housing.id}
              housing={housing}
              isFavorite={wishlist.some((item) => item.id === housing.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default SeasonBestSection;
