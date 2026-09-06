import type { HousingListItem } from "./housingList.types";

export const getAmenities = (housing: HousingListItem) => {
  const source = housing.amenities ?? housing.facilities ?? [];

  return source
    .map((item) => {
      if (typeof item === "string") return item;
      if (!item || typeof item !== "object") return "";

      const value = item as Record<string, unknown>;
      const label = value.name ?? value.title ?? value.label;

      return typeof label === "string" ? label : "";
    })
    .filter(Boolean);
};

export const getRating = (housing: HousingListItem) =>
  Number(housing.averageRating ?? housing.rating ?? 0);

export const getReviewCount = (housing: HousingListItem) =>
  Number(housing.reviewsCount ?? housing.reviewCount ?? 0);

export const getPageNumbers = (
  page: number,
  totalPages: number
): (number | "...")[] => {
  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  pages.push(1);
  if (page > 3) pages.push("...");

  for (
    let i = Math.max(2, page - 1);
    i <= Math.min(totalPages - 1, page + 1);
    i++
  ) {
    pages.push(i);
  }

  if (page < totalPages - 2) pages.push("...");
  pages.push(totalPages);

  return pages;
};
