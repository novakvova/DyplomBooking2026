import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { housingApi } from "../api/api";
import type { Housing } from "../types/housing";
import { useCurrency } from "./useCurrency";

import { INITIAL_FILTERS } from "../components/HousingList/housingList.constants";
import {
  getAmenities,
  getPageNumbers,
  getRating,
} from "../components/HousingList/housingList.utils";
import type {
  HousingFilterArrayField,
  HousingFiltersState,
  HousingListItem,
} from "../components/HousingList/housingList.types";

const HISTOGRAM_BINS = 18;

const getPriceStep = (max: number) => {
  if (max <= 100) return 5;
  if (max <= 500) return 10;
  if (max <= 2_000) return 50;
  if (max <= 10_000) return 100;
  if (max <= 50_000) return 500;
  if (max <= 100_000) return 1_000;
  return 5_000;
};

export const useHousingList = () => {
  const { currency, convert } = useCurrency();

  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [guests, setGuests] = useState("");
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] =
    useState<HousingFiltersState>(() => ({
      ...INITIAL_FILTERS,
    }));

  const {
    data: housings = [],
    isLoading,
    error,
  } = useQuery<Housing[]>({
    queryKey: ["housing-list"],
    queryFn: () => housingApi.getAll({}),
  });

  const housingItems =
    housings as HousingListItem[];

  const convertedPrices = housingItems
    .map((housing) =>
      convert(
        Number(
          housing.pricePerNight ?? 0
        )
      )
    )
    .filter(
      (price) =>
        Number.isFinite(price) &&
        price >= 0
    );

  const rawMaxPrice =
    convertedPrices.length > 0
      ? Math.max(...convertedPrices)
      : Math.max(convert(10_000), 100);

  const priceStep =
    getPriceStep(rawMaxPrice);

  const priceRangeMax =
    Math.max(
      priceStep,
      Math.ceil(
        rawMaxPrice / priceStep
      ) * priceStep
    );

  const histogramCounts =
    Array.from(
      { length: HISTOGRAM_BINS },
      () => 0
    );

  convertedPrices.forEach((price) => {
    const index = Math.min(
      HISTOGRAM_BINS - 1,
      Math.floor(
        (price / priceRangeMax) *
          HISTOGRAM_BINS
      )
    );

    histogramCounts[index]++;
  });

  const maxHistogramCount =
    Math.max(
      ...histogramCounts,
      1
    );

  const histogram =
    histogramCounts.map((count) => ({
      count,
      height: Math.round(
        (count /
          maxHistogramCount) *
          100
      ),
    }));

  const priceRange = {
    max: priceRangeMax,
    step: priceStep,
    histogram,
  };

  const toggleArrayFilter = (
    field: HousingFilterArrayField,
    value: string
  ) => {
    setFilters((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter(
            (item) => item !== value
          )
        : [
            ...current[field],
            value,
          ],
    }));
  };

  const clearFilters = () => {
    setFilters({
      ...INITIAL_FILTERS,
    });
  };

  let filteredHousings =
    housingItems.filter((housing) => {
      const search =
        filters.search
          .trim()
          .toLocaleLowerCase();

      const destinationQuery =
        destination
          .trim()
          .toLocaleLowerCase();

      const title =
        housing.title
          ?.toLocaleLowerCase() ?? "";

      const city =
        housing.city
          ?.toLocaleLowerCase() ?? "";

      const address =
        housing.address
          ?.toLocaleLowerCase() ?? "";

      const price = convert(
        Number(
          housing.pricePerNight ?? 0
        )
      );

      const rating =
        getRating(housing);

      const type = String(
        housing.type ?? ""
      ).toLocaleLowerCase();

      const amenities =
        getAmenities(housing).map(
          (item) =>
            item.toLocaleLowerCase()
        );

      if (
        search &&
        !`${title} ${city} ${address}`.includes(
          search
        )
      ) {
        return false;
      }

      if (
        destinationQuery &&
        !`${city} ${address}`.includes(
          destinationQuery
        )
      ) {
        return false;
      }

      if (
        filters.minPrice &&
        price <
          Number(filters.minPrice)
      ) {
        return false;
      }

      if (
        filters.maxPrice &&
        price >
          Number(filters.maxPrice)
      ) {
        return false;
      }

      if (
        filters.minRating &&
        rating <
          filters.minRating
      ) {
        return false;
      }

      if (
        filters.types.length &&
        !filters.types.some(
          (item) =>
            item.toLocaleLowerCase() ===
            type
        )
      ) {
        return false;
      }

      if (
        filters.amenities.length &&
        !filters.amenities.every(
          (selectedAmenity) =>
            amenities.some(
              (amenity) =>
                amenity.includes(
                  selectedAmenity.toLocaleLowerCase()
                )
            )
        )
      ) {
        return false;
      }

      return true;
    });

  if (sort === "rating") {
    filteredHousings = [
      ...filteredHousings,
    ].sort(
      (a, b) =>
        getRating(b) -
        getRating(a)
    );
  }

  if (sort === "price-low") {
    filteredHousings = [
      ...filteredHousings,
    ].sort(
      (a, b) =>
        Number(
          a.pricePerNight ?? 0
        ) -
        Number(
          b.pricePerNight ?? 0
        )
    );
  }

  if (sort === "price-high") {
    filteredHousings = [
      ...filteredHousings,
    ].sort(
      (a, b) =>
        Number(
          b.pricePerNight ?? 0
        ) -
        Number(
          a.pricePerNight ?? 0
        )
    );
  }

  useEffect(() => {
    setPage(1);
  }, [
    destination,
    filters,
    sort,
    pageSize,
    currency,
  ]);

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      minPrice: "",
      maxPrice: "",
    }));
  }, [currency]);

  const totalItems =
    filteredHousings.length;

  const totalPages =
    Math.ceil(
      totalItems / pageSize
    );

  const safePage =
    totalPages > 0
      ? Math.min(
          page,
          totalPages
        )
      : 1;

  const pagedHousings =
    filteredHousings.slice(
      (safePage - 1) * pageSize,
      safePage * pageSize
    );

  const pageNumbers =
    getPageNumbers(
      safePage,
      totalPages
    );

  return {
    destination,
    setDestination,
    dates,
    setDates,
    guests,
    setGuests,
    sort,
    setSort,
    page: safePage,
    setPage,
    pageSize,
    setPageSize,
    filters,
    setFilters,
    toggleArrayFilter,
    clearFilters,
    priceRange,
    isLoading,
    error,
    totalItems,
    totalPages,
    pagedHousings,
    pageNumbers,
  };
};
