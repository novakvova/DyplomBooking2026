import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { wishlistFolderApi } from "../api/wishlistFolderApi";

// Єдиний hook для списку папок користувача та CRUD-операцій.
export const useWishlistFolders = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["wishlist-folders"],
    queryFn: wishlistFolderApi.getAll,
  });

  // Створення папки.
  const createMutation = useMutation({
    mutationFn: wishlistFolderApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist-folders"] });
    },
  });

  // Перейменування папки.
  const renameMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      wishlistFolderApi.rename(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist-folders"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-folder"] });
    },
  });

  // Видалення папки.
  const deleteMutation = useMutation({
    mutationFn: wishlistFolderApi.remove,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist-folders"] });
      queryClient.removeQueries({ queryKey: ["wishlist-folder", id] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  return {
    folders: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    isCreating: createMutation.isPending,
    isRenaming: renameMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createFolder: createMutation.mutateAsync,
    renameFolder: renameMutation.mutateAsync,
    deleteFolder: deleteMutation.mutateAsync,
  };
};
