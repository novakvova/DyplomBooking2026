export interface Car {
  id: number;

  title: string;
  description?: string;

  imagePath?: string | null;

  brand: string;
  model: string;
  year: number;

  city: string;

  transmission: string;
  fuelType: string;

  seats: number;
  doors?: number;

  pricePerDay: number;

  averageRating?: number;
  reviewCount?: number;

  isAvailable: boolean;
}