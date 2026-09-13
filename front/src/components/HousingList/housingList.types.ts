import type { Housing } from "../../types/housing";

export type HousingListItem = Housing & {
  mainPhotoPath?: string | null;
  rating?: number | null;
  averageRating?: number | null;
  reviewCount?: number | null;
  reviewsCount?: number | null;
  amenities?: unknown[];
  facilities?: unknown[];
};

export interface HousingFiltersState {
  search: string;
  minPrice: string;
  maxPrice: string;
  minRating: number;
  types: string[];
  amenities: string[];
}

export type HousingFilterArrayField = "types" | "amenities";
