import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { housingApi } from "../../api/api";
import type { Housing } from "../../types/housing";
import HomeSectionCard from "./HomeSectionCard";

interface Props {
  wishlist: Housing[];
}

/**
 * Секція "Подорожі будь-якого типу" з дизайну Figma: вкладки
 * Пляж/Гори/Лижі/Сім'я/Культура/Релаксація, під кожною — житло
 * з відповідним Housing.TravelCategory (див. бекенд
 * GET /api/housing/travel-categories для канонічного списку тегів,
 * і GET /api/housing/by-travel-category/{category} для вибірки).
 *
 * Список категорій підвантажується з бекенду (а не хардкодиться
 * тут), щоб вкладки завжди відповідали реальним тегам у даних.
 */
const TravelCategoriesSection = ({ wishlist }: Props) => {
  const { t } = useTranslation();

  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ["housing", "travel-categories"],
    queryFn: housingApi.getTravelCategories,
  });

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Перша категорія стає активною, щойно список підвантажився.
  const current = activeCategory ?? categories[0] ?? null;

  const { data: housings = [], isLoading } = useQuery<Housing[]>({
    queryKey: ["housing", "by-travel-category", current],
    queryFn: () => housingApi.getByTravelCategory(current!, 4),
    enabled: !!current,
  });

  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1383px] px-6 py-10">
      <div className="mb-7 flex flex-col gap-3">
        <h2 className="text-[32px] font-semibold leading-tight text-black min-[1500px]:text-[50px] min-[1500px]:leading-[63px]">
          {t("home.travelCategories.title", "Подорожі будь-якого типу")}
        </h2>
        <p className="text-base font-medium text-[#414141] min-[1500px]:text-xl">
          {t(
            "home.travelCategories.subtitle",
            "Середні ціни на основі поточного календарного місяця"
          )}
        </p>
      </div>

      {/* Вкладки категорій */}
      <div className="mb-7 flex items-center gap-2 overflow-x-auto border-b border-slate-200">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`shrink-0 border-b-[3px] px-4 py-3 text-xl font-medium transition min-[1500px]:text-[30px] ${
              current === category
                ? "border-[#243C4E] font-bold text-[#243C4E]"
                : "border-[#424A50]/20 text-black hover:border-[#424A50]/50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-[363px] animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : housings.length === 0 ? (
        <p className="text-slate-500">
          {t("home.travelCategories.empty", "Поки що немає житла в цій категорії.")}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

export default TravelCategoriesSection;
