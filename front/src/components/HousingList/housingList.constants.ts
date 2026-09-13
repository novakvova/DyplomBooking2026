import type { HousingFiltersState } from "./housingList.types";

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

export const PROPERTY_TYPES = [
  "Hotel", "Apartment", "House", "Villa", "Studio", "Room",
  "Resort", "Vacation home", "A-Frame", "Hostel", "Chalet",
  "Guest house", "Camping",
];

export const AMENITIES = [
  "Free Wi-Fi", "Parking", "Pool", "Spa", "Air conditioning",
  "Kitchen", "Balcony", "Terrace", "Breakfast", "Pets allowed",
];

export const POPULAR_FILTERS = [
  "Free Wi-Fi", "Parking", "Breakfast", "Pool", "Spa",
];

export const INITIAL_FILTERS: HousingFiltersState = {
  search: "",
  minPrice: "",
  maxPrice: "",
  minRating: 0,
  types: [],
  amenities: [],
};
