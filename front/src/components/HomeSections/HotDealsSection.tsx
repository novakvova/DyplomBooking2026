import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { housingApi } from "../../api/api";
import type { Housing } from "../../types/housing";
import HomeSectionCard from "./HomeSectionCard";

interface Props {
  wishlist: Housing[];
}

/**
 * Секція "Гарячі знижки до 40%" — верхній блок головної сторінки
 * з дизайну Figma. Дані беруться з GET /api/housing/hot-deals
 * (житло, позначене IsHotDeal=true в адмінці/сідері).
 */
const HotDealsSection = ({ wishlist }: Props) => {
  const { t } = useTranslation();

  const { data: deals = [], isLoading } = useQuery<Housing[]>({
    queryKey: ["housing", "hot-deals"],
    queryFn: () => housingApi.getHotDeals(4),
  });

  // Немає акційного житла — секцію просто не показуємо,
  // щоб не займати місце порожнім блоком.
  if (!isLoading && deals.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1383px] px-6 py-10">
      <div className="mb-7 flex flex-col gap-3">
        <h2 className="text-[32px] font-semibold leading-tight text-black min-[1500px]:text-[50px] min-[1500px]:leading-[63px]">
          {t("home.hotDeals.title", "Гарячі знижки до 40%")}
        </h2>
        <p className="text-base font-medium text-[#414141] min-[1500px]:text-xl">
          {t("home.hotDeals.subtitle", "Поспішай поки не пізно")}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-[395px] animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((housing) => (
            <HomeSectionCard
              key={housing.id}
              housing={housing}
              isFavorite={wishlist.some((item) => item.id === housing.id)}
              discountPercent={housing.hotDealDiscountPercent}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HotDealsSection;
