import apiClient from "./client";
import type { Housing } from "../types/housing";
import type {
  CreateWishlistFolderRequest,
  WishlistFolder,
} from "../types/wishlist";

export interface WishlistFolderDetails {
  id: number;
  name: string;
  items: Housing[];
}

export const wishlistFolderApi = {
  // Отримати всі папки поточного користувача.
  getAll: async (): Promise<WishlistFolder[]> => {
    const { data } = await apiClient.get("/wishlistfolder");
    return data;
  },

  // Отримати одну папку разом із її помешканнями.
  getById: async (id: number): Promise<WishlistFolderDetails> => {
    const { data } = await apiClient.get(`/wishlistfolder/${id}`);
    return data;
  },

  // Створити папку.
  create: async (
    data: CreateWishlistFolderRequest
  ): Promise<WishlistFolder> => {
    const { data: response } = await apiClient.post(
      "/wishlistfolder",
      data
    );
    return response;
  },

  // Перейменувати папку.
  rename: async (
    id: number,
    data: CreateWishlistFolderRequest
  ): Promise<WishlistFolder> => {
    const { data: response } = await apiClient.put(
      `/wishlistfolder/${id}`,
      data
    );
    return response;
  },

  // Видалити папку.
  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/wishlistfolder/${id}`);
  },

  // Видалити житло тільки з конкретної папки.
  removeItem: async (
    folderId: number,
    housingId: number
  ): Promise<void> => {
    await apiClient.delete(
      `/wishlistfolder/${folderId}/items/${housingId}`
    );
  },
};
