export interface Excursion {
  id: number;

  title: string;
  description?: string;

  imagePath?: string | null;

  city: string;
  country?: string;

  category: string;

  durationHours: number;

  maxGuests: number;

  price: number;

  averageRating?: number;
  reviewCount?: number;

  isAvailable: boolean;
}