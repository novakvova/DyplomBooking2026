import apiClient from "./client";
import type { Housing } from "../types/housing";

const getVisitorId = () => {
  let id = localStorage.getItem("waygo_visitor_id");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("waygo_visitor_id", id);
  }

  return id;
};

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string | null;
  roles: string[];
}

export const authApi = {
  login: async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const { data } = await apiClient.post(
      "/auth/login",
      { email, password }
    );

    return data;
  },

  register: async (
    email: string,
    password: string,
    fullName: string
  ): Promise<AuthResponse> => {
    const { data } = await apiClient.post(
      "/auth/register",
      {
        email,
        password,
        fullName,
      }
    );

    return data;
  },

  forgotPassword: async (
    email: string
  ): Promise<void> => {
    await apiClient.post(
      "/auth/forgot-password",
      { email }
    );
  },
};

// ─────────────────────────────────────────────
// HOUSING
// ─────────────────────────────────────────────

export interface HousingPhoto {
  id: number;
  filePath: string;
  isMain: boolean;
}

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

export const housingApi = {
  getById: async (
    id: number
  ): Promise<Housing> => {
    const response = await fetch(
      `https://localhost:7080/api/Housing/${id}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load housing"
      );
    }

    return response.json();
  },

  getPhotos: async (
    id: number
  ) => {
    const response = await fetch(
      `https://localhost:7080/api/Housing/${id}/photos`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load photos"
      );
    }

    return response.json();
  },

  getAll: async ({
    city,
    minGuests,
    maxPrice,
    rooms,
  }: {
    city?: string;
    minGuests?: number;
    maxPrice?: number;
    rooms?: number;
  }) => {
    const params = new URLSearchParams();

    if (city) {
      params.append(
        "city",
        city
      );
    }

    if (minGuests) {
      params.append(
        "minGuests",
        String(minGuests)
      );
    }

    if (maxPrice) {
      params.append(
        "maxPrice",
        String(maxPrice)
      );
    }

    if (rooms) {
      params.append(
        "rooms",
        String(rooms)
      );
    }

    const response = await fetch(
      `https://localhost:7080/api/Housing?${params}`
    );

    return response.json();
  },

  book: async (
    id: number,
    dto: {
      checkIn: string;
      checkOut: string;
      guestsCount: number;
    }
  ): Promise<HousingBooking> => {
    const { data } = await apiClient.post(
      `/housing/${id}/book`,
      dto
    );

    return data;
  },
};

// ─────────────────────────────────────────────
// DESTINATIONS
// ─────────────────────────────────────────────

export const destinationApi = {
  getPopular: async () => {
    const response = await fetch(
      "https://localhost:7080/api/Destinations/popular"
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load destinations"
      );
    }

    return response.json();
  },

  search: async (
    query: string
  ) => {
    const response = await fetch(
      `https://localhost:7080/api/Destinations/search?query=${query}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to search destinations"
      );
    }

    return response.json();
  },

  registerView: async (
    id: number
  ): Promise<{
    id: number;
    viewCount: number;
    counted: boolean;
  }> => {
    const { data } = await apiClient.post(
      `/destinations/${id}/view`,
      {},
      {
        headers: {
          "X-Visitor-Id": getVisitorId(),
        },
      }
    );

    return data;
  },


};

// ─────────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────────

export const PaymentMethod = {
  CreditCard: 0,
  DebitCard: 1,
  PayPal: 2,
  BankTransfer: 3,
} as const;

export type PaymentMethod =
  typeof PaymentMethod[
    keyof typeof PaymentMethod
  ];

export const PaymentStatus = {
  Pending: 0,
  Processing: 1,
  Paid: 2,
  Failed: 3,
  Refunded: 4,
} as const;

export type PaymentStatus =
  typeof PaymentStatus[
    keyof typeof PaymentStatus
  ];

export interface Payment {
  id: number;
  transactionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string;
  maskedCard: string | null;
  createdAt: string;
  paidAt: string | null;
  failureReason: string | null;
  bookingId: number | null;
  housingBookingId: number | null;
}

export const paymentsApi = {
  payHousingBooking: async (
    dto: {
      housingBookingId: number;
      method: PaymentMethod;
      cardLastFour?: string;
    }
  ): Promise<Payment> => {
    const { data } = await apiClient.post(
      "/payments/pay-housing-booking",
      dto
    );

    return data;
  },

  getMy: async (): Promise<Payment[]> => {
    const { data } = await apiClient.get(
      "/payments/my"
    );

    return data;
  },

  refund: async (
    paymentId: number
  ): Promise<Payment> => {
    const { data } = await apiClient.post(
      "/payments/refund",
      { paymentId }
    );

    return data;
  },
};

export const PaymentStatusLabel: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: "Очікує",
  [PaymentStatus.Processing]: "Обробляється",
  [PaymentStatus.Paid]: "Оплачено",
  [PaymentStatus.Failed]: "Відхилено",
  [PaymentStatus.Refunded]: "Повернено",
};

export const PaymentStatusColor: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]:
    "text-yellow-600 bg-yellow-50",

  [PaymentStatus.Processing]:
    "text-blue-600 bg-blue-50",

  [PaymentStatus.Paid]:
    "text-green-600 bg-green-50",

  [PaymentStatus.Failed]:
    "text-red-600 bg-red-50",

  [PaymentStatus.Refunded]:
    "text-slate-600 bg-slate-50",
};

// ─────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────

export const profileApi = {
  get: async () => {
    const { data } = await apiClient.get(
      "/profile"
    );

    return data;
  },

  getMyBookings: async (): Promise<HousingBooking[]> => {
    const { data } = await apiClient.get(
      "/housing/bookings/my"
    );

    return data;
  },
};

// ─────────────────────────────────────────────
// WISHLIST
// ─────────────────────────────────────────────

export const wishlistApi = {
  // Усі унікальні збережені житла.
  getAll: async (): Promise<Housing[]> => {
    const { data } = await apiClient.get("/wishlist");
    return data;
  },

  // Додати житло в одну або декілька папок.
  add: async (housingId: number, folderIds: number[]): Promise<void> => {
    await apiClient.post("/wishlist/add", {
      housingId,
      folderIds,
    });
  },

  // Повністю прибрати житло з усіх папок.
  remove: async (housingId: number): Promise<void> => {
    await apiClient.delete(`/wishlist/${housingId}`);
  },

  // Перевірити, чи є житло хоча б в одній папці.
  check: async (housingId: number): Promise<{ isFavorite: boolean }> => {
    const { data } = await apiClient.get(`/wishlist/${housingId}/check`);
    return data;
  },

  // Видалити житло тільки з конкретної папки.
  removeFromFolder: async (folderId: number, housingId: number): Promise<void> => {
    await apiClient.delete(`/wishlistfolder/${folderId}/items/${housingId}`);
  },
};
