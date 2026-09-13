export interface Review {
  id: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReview {
  housingId: number;
  rating: number;
  comment: string;
}