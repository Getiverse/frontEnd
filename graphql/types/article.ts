export type GraphqlArticle = {
  id?: string;
  userId?: string;
  image?: string;
  title?: string;
  createdAt?: string;
  content?: string;
  ratings?: string[];
  ratingSum: number;
  ratingsNumber: number;
  categories?: string[];
  views?: number;
  postDate?: string;
  readTime?: number;
  postTime?: string;
};
