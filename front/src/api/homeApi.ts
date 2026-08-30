import apiClient, { getMediaUrl } from "./client";

export type TravelCategory = "Beach" | "Mountains" | "Ski" | "Family" | "Culture" | "Relax";

export const homeWishlistApi = {
  getIds: async (): Promise<number[]> => {
    const response = await apiClient.get<number[]>("/home-wishlist");
    return response.data;
  },

  add: async (housingId: number): Promise<void> => {
    await apiClient.post(`/home-wishlist/${housingId}`);
  },

  remove: async (housingId: number): Promise<void> => {
    await apiClient.delete(`/home-wishlist/${housingId}`);
  },
};

export interface HomeHousing {
  id: number;
  title: string;
  city: string;
  country: string;
  pricePerNight: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  mainPhotoPath?: string | null;
}

export interface HomeDestination {
  id: number;
  slug: string;
  city: string;
  country: string;
  imagePath: string;
}

export interface HomeData {
  hotDeals: HomeHousing[];
  popularDestinations: HomeDestination[];
  travelTypes: Partial<Record<TravelCategory, HomeHousing[]>>;
  seasonalHotels: HomeHousing[];
}

export const homeApi = {
  get: async () => (await apiClient.get<HomeData>("/home")).data,
  image: getMediaUrl,
};