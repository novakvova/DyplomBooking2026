export interface AdminReview {
  id: number;

  userId: string;
  userName: string;
  userEmail: string;

  housingId: number;
  housingTitle: string;

  rating: number;
  comment: string;

  isVisible: boolean;
  createdAt: string;
}

export interface AdminReviewsResponse {
  items: AdminReview[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}