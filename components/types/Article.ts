export type Article = {
  author: {
    src: string;
    authorName: string;
    authorId: string;
  };
  postId: string;
  image: string;
  isSketch?: boolean;
  index?: number;
  title: string;
  createdAt: string;
  readMinutes: number;
  categories: string[];
  rating: number;
  id: string;
  isEditable: boolean;
  content: string;
};
