import apiClient from "./client";

import type {
  AdminUserDetails,
  AdminUsersResponse,
} from "../admin/types/user";

import type { AdminHousingDetails, AdminHousingsResponse } from "../admin/types/housing";
import type { AdminBookingDetails, AdminBookingsResponse } from "../admin/types/booking";
import type { AdminReviewsResponse } from "../admin/types/review";
import type { AdminDestination, AdminDestinationRequest, AdminDestinationsResponse } from "../admin/types/destination";

// ─────────────────────────────────────────────
// ADMIN USERS
// ─────────────────────────────────────────────

export interface AdminUsersParams {
  search?: string;
  role?: string;
  isBlocked?: boolean;
  page?: number;
  pageSize?: number;
}

export const adminUsersApi = {
  getAll: async (
    params: AdminUsersParams = {}
  ): Promise<AdminUsersResponse> => {
    const { data } = await apiClient.get(
      "/admin/users",
      { params }
    );

    return data;
  },

  getById: async (
    id: string
  ): Promise<AdminUserDetails> => {
    const { data } = await apiClient.get(
      `/admin/users/${id}`
    );

    return data;
  },

  updateRole: async (
    id: string,
    role: string
  ): Promise<void> => {
    await apiClient.patch(
      `/admin/users/${id}/role`,
      { role }
    );
  },

  block: async (
    id: string
  ): Promise<void> => {
    await apiClient.patch(
      `/admin/users/${id}/block`
    );
  },

  unblock: async (
    id: string
  ): Promise<void> => {
    await apiClient.patch(
      `/admin/users/${id}/unblock`
    );
  },
};

// ─────────────────────────────────────────────
// ADMIN HOUSING
// ─────────────────────────────────────────────

export interface AdminHousingsParams {
  search?: string;
  type?: string;
  isAvailable?: boolean;
  page?: number;
  pageSize?: number;
}

export const adminHousingApi = {
  getAll: async (
    params: AdminHousingsParams = {}
  ): Promise<AdminHousingsResponse> => {
    const { data } = await apiClient.get(
      "/admin/housing",
      { params }
    );

    return data;
  },

  getById: async (
    id: number
  ): Promise<AdminHousingDetails> => {
    const { data } = await apiClient.get(
      `/admin/housing/${id}`
    );

    return data;
  },

  setAvailability: async (
    id: number,
    isAvailable: boolean
  ): Promise<void> => {
    await apiClient.patch(
      `/admin/housing/${id}/availability`,
      { isAvailable }
    );
  },

  delete: async (
    id: number
  ): Promise<void> => {
    await apiClient.delete(
      `/admin/housing/${id}`
    );
  },
};

// ─────────────────────────────────────────────
// ADMIN BOOKINGS
// ─────────────────────────────────────────────

export interface AdminBookingsParams {
  search?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export const adminBookingsApi = {
  getAll: async (
    params: AdminBookingsParams = {}
  ): Promise<AdminBookingsResponse> => {
    const { data } = await apiClient.get(
      "/admin/bookings",
      { params }
    );

    return data;
  },

  getById: async (
    id: number
  ): Promise<AdminBookingDetails> => {
    const { data } = await apiClient.get(
      `/admin/bookings/${id}`
    );

    return data;
  },

  updateStatus: async (
    id: number,
    status: string
  ): Promise<void> => {
    await apiClient.patch(
      `/admin/bookings/${id}/status`,
      { status }
    );
  },
};

// ─────────────────────────────────────────────
// ADMIN REVIEW
// ─────────────────────────────────────────────

export interface AdminReviewsParams {
  search?: string;
  rating?: number;
  isVisible?: boolean;
  page?: number;
  pageSize?: number;
}

export const adminReviewsApi = {
  getAll: async (
    params: AdminReviewsParams = {}
  ): Promise<AdminReviewsResponse> => {
    const { data } = await apiClient.get(
      "/admin/reviews",
      { params }
    );

    return data;
  },

  setVisibility: async (
    id: number,
    isVisible: boolean
  ): Promise<void> => {
    await apiClient.patch(
      `/admin/reviews/${id}/visibility`,
      isVisible,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },

  delete: async (
    id: number
  ): Promise<void> => {
    await apiClient.delete(
      `/admin/reviews/${id}`
    );
  },
};

// ─────────────────────────────────────────────
// ADMIN DESTINATIONS
// ─────────────────────────────────────────────

export interface AdminDestinationsParams {
  search?: string;
  isPopular?: boolean;
  page?: number;
  pageSize?: number;
}

export const adminDestinationsApi = {
  getAll: async (
    params: AdminDestinationsParams = {}
  ): Promise<AdminDestinationsResponse> => {
    const { data } = await apiClient.get(
      "/admin/destinations",
      { params }
    );

    return data;
  },

  getById: async (
    id: number
  ): Promise<AdminDestination> => {
    const { data } = await apiClient.get(
      `/admin/destinations/${id}`
    );

    return data;
  },

  create: async (
    dto: AdminDestinationRequest
  ): Promise<AdminDestination> => {
    const { data } = await apiClient.post(
      "/admin/destinations",
      dto
    );

    return data;
  },

  update: async (
    id: number,
    dto: AdminDestinationRequest
  ): Promise<void> => {
    await apiClient.put(
      `/admin/destinations/${id}`,
      dto
    );
  },

  setPopular: async (
    id: number,
    isPopular: boolean
  ): Promise<void> => {
    await apiClient.patch(
      `/admin/destinations/${id}/popular`,
      isPopular,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },

  getTracking: async (): Promise<{ enabled: boolean }> => {
    const { data } = await apiClient.get(
        "/admin/destinations/tracking"
    );

    return data;
  },

  setTracking: async (
    enabled: boolean
    ): Promise<void> => {
    await apiClient.patch(
        "/admin/destinations/tracking",
        { enabled }
    );
  },

  getViewLimit: async (): Promise<{ enabled: boolean }> => {
    const { data } = await apiClient.get(
        "/admin/destinations/view-limit"
    );

    return data;
    },

    setViewLimit: async (
    enabled: boolean
    ): Promise<void> => {
    await apiClient.patch(
        "/admin/destinations/view-limit",
        { enabled }
    );
  },

  uploadImage: async (
    file: File,
    slug?: string
  ): Promise<{ imagePath: string }> => {
    const formData = new FormData();

    formData.append("file", file);

    if (slug) {
      formData.append("slug", slug);
    }

    const { data } = await apiClient.post(
      "/admin/destinations/upload-image",
      formData
    );

    return data;
  },

  delete: async (
    id: number
  ): Promise<void> => {
    await apiClient.delete(
      `/admin/destinations/${id}`
    );
  },
};