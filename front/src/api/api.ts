import apiClient from './client';

// ── Auth ───────────────────────────────────────────
export interface AuthResponse {
  token: string;
  email: string;
  fullName: string | null;
  roles: string[];
}

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },

  register: async (email: string, password: string, fullName: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', { email, password, fullName });
    return data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },
};

// ── Housing ────────────────────────────────────────
export interface Housing {
  id: number;
  title: string;
  description: string | null;
  type: string;
  address: string;
  city: string;
  rooms: number;
  maxGuests: number;
  pricePerNight: number;
  isAvailable: boolean;
  ownerName: string;
  createdAt: string;
}

export interface HousingPhoto {
  id: number;
  filePath: string;
  isMain: boolean;
}

export const housingApi = {
  getAll: async (params?: { city?: string; minGuests?: number; maxPrice?: number }): Promise<Housing[]> => {
    const { data } = await apiClient.get('/housing', { params });
    return data;
  },

  getById: async (id: number): Promise<Housing> => {
    const { data } = await apiClient.get(`/housing/${id}`);
    return data;
  },

  getPhotos: async (id: number): Promise<HousingPhoto[]> => {
    const { data } = await apiClient.get(`/housing/${id}/photos`);
    return data;
  },

  book: async (id: number, dto: { checkIn: string; checkOut: string; guestsCount: number }) => {
    const { data } = await apiClient.post(`/housing/${id}/book`, dto);
    return data;
  },
};

// ── Profile ────────────────────────────────────────
export const profileApi = {
  get: async () => {
    const { data } = await apiClient.get('/profile');
    return data;
  },
  getMyBookings: async () => {
    const { data } = await apiClient.get('/housing/bookings/my');
    return data;
  },
};
