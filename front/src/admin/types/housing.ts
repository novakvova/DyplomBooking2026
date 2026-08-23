export interface AdminHousingPhoto {
  id: number;
  filePath: string;
  isMain: boolean;
}

export interface AdminHousingDetails {
  id: number;
  title: string;
  description: string;
  type: string;
  address: string;
  city: string;
  rooms: number;
  maxGuests: number;
  pricePerNight: number;
  isAvailable: boolean;
  createdAt: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  bookingsCount: number;
  photos: AdminHousingPhoto[];
}

export interface AdminHousingListItem {
  id: number;
  title: string;
  city: string;
  type: string;
  pricePerNight: number;
  isAvailable: boolean;
  createdAt: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  bookingsCount: number;
  mainPhotoPath: string | null;
}

export interface AdminHousingsResponse {
  items: AdminHousingListItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}