import type { Housing } from "../../types/housing";

export interface BookingForm { checkIn: string; checkOut: string; guestsCount: number; }

export type HousingDetails = Housing & {
  averageRating?: number | null; rating?: number | null; reviewCount?: number | null; reviewsCount?: number | null;
  bedrooms?: number; beds?: number; bathrooms?: number; amenities?: string[]; highlights?: string[];
  rentalFormat?: string; pricePerHour?: number; checkInTime?: string; checkOutTime?: string;
  smokingRule?: string; petsRule?: string; partiesRule?: string; quietHoursMode?: string; quietHoursFrom?: string; quietHoursTo?: string;
  additionalRules?: string; securityCameras?: boolean; noiseMonitor?: boolean; propertySafetyFeatures?: boolean;
  securityCamerasDescription?: string; noiseMonitorDescription?: string; propertySafetyFeaturesDescription?: string;
  ownerName?: string | null; cleanlinessRating?: number | null; communicationRating?: number | null;
  checkInRating?: number | null; accuracyRating?: number | null; locationRating?: number | null; valueRating?: number | null;
};

export interface RatingMetricItem { label: string; value: number; }
