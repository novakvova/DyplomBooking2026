export interface Housing {
  id: number;
  title: string;
  description: string | null;
  type: string;
  address: string;
  city: string;
  rooms: number;
  maxGuests: number;
  pricePerNight: number;
  mainPhotoPath: string | null;
  isAvailable: boolean;
  ownerName: string;
  createdAt: string;
  // Рейтинг та відгуки.
  averageRating: number;
  reviewCount: number;
  // Секції головної сторінки.
  travelCategory: string;
  isHotDeal: boolean;
  hotDealDiscountPercent: number;
  isSeasonBest: boolean;
}