export interface Car {
  id: number;
  title: string;
  brand: string;
  model: string;

  city: string;

  pricePerDay: number;

  transmission: string;
  fuelType: string;

  seats: number;

  mainPhotoPath: string | null;

  rating: number;
  reviewCount: number;

  features: string[];
}