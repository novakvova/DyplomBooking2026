import apiClient from './client';

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

export interface CreateHousingDto {
  title: string;
  description?: string;
  type: number;
  address: string;
  city: string;
  rooms: number;
  maxGuests: number;
  pricePerNight: number;
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

  create: async (dto: CreateHousingDto): Promise<Housing> => {
    const { data } = await apiClient.post('/housing', dto);
    return data;
  },

  update: async (id: number, dto: Partial<CreateHousingDto>): Promise<Housing> => {
    const { data } = await apiClient.put(`/housing/${id}`, dto);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/housing/${id}`);
  },

  uploadPhoto: async (id: number, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await apiClient.post(`/housing/${id}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getPhotos: async (id: number) => {
    const { data } = await apiClient.get(`/housing/${id}/photos`);
    return data;
  },

  deletePhoto: async (housingId: number, photoId: number): Promise<void> => {
    await apiClient.delete(`/housing/${housingId}/photos/${photoId}`);
  },
};
