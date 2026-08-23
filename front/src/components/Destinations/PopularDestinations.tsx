import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { destinationApi } from "../../api/api";
import type { Destination } from "../../types/destination";
import DestinationCard from "./DestinationCard";

interface PopularDestinationsProps {
  onDestinationOpen?: (destination: Destination) => void;
}

const PopularDestinations = ({ onDestinationOpen }: PopularDestinationsProps) => {
  const { t } = useTranslation();

  const { data = [], isLoading } = useQuery<Destination[]>({
    queryKey: ["popular-destinations"],
    queryFn: destinationApi.getPopular,
  });

  if (isLoading) {
    return <p className="text-sm text-slate-500">{t("common.loading")}</p>;
  }

  return (
    <div className="w-[607px] rounded-2xl bg-white p-5 shadow-xl">
      <h2 className="mb-5 text-xl font-bold">
        {t("destinationDropdown.popular")}
      </h2>

      <div className="flex flex-col gap-4">
        {data.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            onClick={() => onDestinationOpen?.(destination)}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularDestinations;