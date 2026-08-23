export interface AdminBookingPayment {
  id: number;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  createdAt: string;
}

export interface AdminBookingDetails {
  id: number;

  housingId: number;
  housingTitle: string;
  housingCity: string;
  housingMainPhotoPath: string | null;

  userId: string;
  userName: string;
  userEmail: string;

  checkIn: string;
  checkOut: string;

  guestsCount: number;
  totalPrice: number;

  status: string;

  payment: AdminBookingPayment | null;
}

export interface AdminBookingListItem {
  id: number;

  housingId: number;
  housingTitle: string;

  userId: string;
  userName: string;
  userEmail: string;

  checkIn: string;
  checkOut: string;

  guestsCount: number;
  totalPrice: number;

  status: string;
  createdAt: string;
}

export interface AdminBookingsResponse {
  items: AdminBookingListItem[];

  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}