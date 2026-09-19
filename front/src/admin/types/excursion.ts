export interface Excursion {
  id: number;

  title: string;
  city: string;

  description: string | null;

  price: number;

  duration: string;

  language: string;

  category: string;

  mainPhotoPath: string | null;

  rating: number;
  reviewCount: number;
}