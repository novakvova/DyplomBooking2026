import apiClient from './client';

// ── Rooms ──────────────────────────────────────────
export interface Room {
  id: number;
  name: string;
  description: string | null;
  capacity: number;
  pricePerHour: number;
  location: string | null;
  isActive: boolean;
}

export const roomsApi = {
  getAll: async (): Promise<Room[]> => {
    const { data } = await apiClient.get('/rooms');
    return data;
  },
  create: async (dto: Omit<Room, 'id' | 'isActive'>): Promise<Room> => {
    const { data } = await apiClient.post('/rooms', dto);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/rooms/${id}`);
  },
};

// ── Bookings ───────────────────────────────────────
export interface Booking {
  id: number;
  roomId: number;
  roomName: string;
  userId: string;
  userFullName: string | null;
  startTime: string;
  endTime: string;
  status: number;
}

export const bookingsApi = {
  getAll: async (): Promise<Booking[]> => {
    const { data } = await apiClient.get('/bookings');
    return data;
  },
  getMy: async (): Promise<Booking[]> => {
    const { data } = await apiClient.get('/bookings/my');
    return data;
  },
  updateStatus: async (id: number, status: number): Promise<void> => {
    await apiClient.patch(`/bookings/${id}/status`, status, {
      headers: { 'Content-Type': 'application/json' },
    });
  },
  cancel: async (id: number): Promise<void> => {
    await apiClient.delete(`/bookings/${id}`);
  },
};

// ── Housing Bookings ───────────────────────────────
export interface HousingBooking {
  id: number;
  housingId: number;
  housingTitle: string;
  userId: string;
  userFullName: string | null;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  status: number;
  totalPrice: number;
}

export const housingBookingsApi = {
  getAll: async (): Promise<HousingBooking[]> => {
    const { data } = await apiClient.get('/housing/bookings');
    return data;
  },
  updateStatus: async (id: number, status: number): Promise<void> => {
    await apiClient.patch(`/housing/bookings/${id}/status`, status, {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};

// ── Payments ───────────────────────────────────────
export interface Payment {
  id: number;
  transactionId: string;
  amount: number;
  currency: string;
  status: number;
  method: string;
  maskedCard: string | null;
  createdAt: string;
  paidAt: string | null;
  failureReason: string | null;
  bookingId: number | null;
  housingBookingId: number | null;
}

export const paymentsApi = {
  getAll: async (): Promise<Payment[]> => {
    const { data } = await apiClient.get('/payments');
    return data;
  },
  getMy: async (): Promise<Payment[]> => {
    const { data } = await apiClient.get('/payments/my');
    return data;
  },
  refund: async (paymentId: number): Promise<void> => {
    await apiClient.post('/payments/refund', { paymentId });
  },
};

// ── Status helpers ─────────────────────────────────
export const BookingStatusLabel: Record<number, string> = {
  0: 'Pending',
  1: 'Confirmed',
  2: 'Cancelled',
  3: 'Completed',
};

export const PaymentStatusLabel: Record<number, string> = {
  0: 'Pending',
  1: 'Processing',
  2: 'Paid',
  3: 'Failed',
  4: 'Refunded',
};

export const PaymentStatusColor: Record<number, string> = {
  0: 'text-yellow-500',
  1: 'text-blue-500',
  2: 'text-green-500',
  3: 'text-red-500',
  4: 'text-gray-500',
};
