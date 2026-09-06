// Папка списку бажань.
export interface WishlistFolder {
  id: number;
  name: string;
  count: number;
  previewImages: string[];
}

// Дані для створення/перейменування папки.
export interface CreateWishlistFolderRequest {
  name: string;
}
