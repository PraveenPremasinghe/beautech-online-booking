export interface CustomerReview {
  id: string;
  authorName: string;
  rating: number;
  /** ISO date YYYY-MM-DD */
  date: string;
  serviceName?: string;
  professionalName?: string;
  comment: string;
}
