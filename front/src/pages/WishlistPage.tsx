import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { wishlistApi } from "../api/api";

import HousingCard from "../components/HousingCard/HousingCard";

import type { Housing } from "../types/housing";

const WishlistPage = () => {
  const { t } = useTranslation();

  const {
    data: wishlist = [],
    isLoading,
    error,
  } = useQuery<Housing[]>({
    queryKey: ["wishlist"],
    queryFn: wishlistApi.getAll,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900">
          {t("wishlist.title")}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {t("wishlist.subtitle")}
        </p>

        {/* Loading */}
        {isLoading && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[350px] animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-xl bg-red-50 p-6 text-red-600">
            {t("wishlist.loadError")}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && wishlist.length === 0 && (
          <div className="mt-8 flex min-h-[350px] flex-col items-center justify-center rounded-2xl bg-white p-10 text-center shadow-sm">
            <span className="text-6xl text-slate-300">♡</span>

            <h2 className="mt-5 text-xl font-semibold text-slate-800">
              {t("wishlist.empty.title")}
            </h2>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              {t("wishlist.empty.description")}
            </p>
          </div>
        )}

        {/* Wishlist items */}
        {wishlist.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((housing) => (
              <HousingCard
                key={housing.id}
                housing={housing}
                isFavorite
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default WishlistPage;