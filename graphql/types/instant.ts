export type GraphqlInstant = {
  id: string;
  userId: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  ratings?: string[];
  ratingSum: number;
  ratingsNumber: number;
  categories: string[];
  views?: number;
};
