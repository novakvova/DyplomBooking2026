export interface AdminDestination {
  id: number;
  slug: string;
  countryCode: string;
  city: string;
  country: string;
  imagePath: string;
  description: string;
  viewCount: number;
  isPopular: boolean;
}

export interface AdminDestinationsResponse {
  items: AdminDestination[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface AdminDestinationRequest {
  slug: string;
  countryCode: string;
  city: string;
  country: string;
  imagePath: string;
  description: string;
  isPopular: boolean;
}