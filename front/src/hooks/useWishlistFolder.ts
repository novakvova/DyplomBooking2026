import { useQuery } from "@tanstack/react-query";

import { wishlistFolderApi } from "../api/wishlistFolderApi";

// Отримує конкретну папку та її помешкання одним запитом.
export const useWishlistFolder = (id?: number) => {
  const query = useQuery({
    queryKey: ["wishlist-folder", id],
    queryFn: () => wishlistFolderApi.getById(id!),
    enabled: Number.isFinite(id),
  });

  return {
    folder: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};
