export interface AdminUser {
  id: string;
  email: string;
  fullName: string | null;
  avatarPath: string | null;
  isBlocked: boolean;
  createdAt: string;
  roles: string[];
  housingsCount: number;
  bookingsCount: number;
  wishlistCount: number;
}

export interface AdminUsersResponse {
  items: AdminUser[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface AdminUserDetails extends AdminUser {
  housings: AdminUserHousing[];
  bookings: AdminUserBooking[];
  wishlist: AdminUserWishlist[];
}

export interface AdminUserHousing {
  id: number;
  title: string;
  city: string;
  pricePerNight: number;
  isAvailable: boolean;
  mainPhotoPath: string | null;
}

export interface AdminUserBooking {
  id: number;
  housingId: number;
  housingTitle: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalPrice: number;
  status: string;
}

export interface AdminUserWishlist {
  housingId: number;
  title: string;
  city: string;
  pricePerNight: number;
  mainPhotoPath: string | null;
}