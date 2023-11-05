import { delay } from "./../../functions";
import { toast } from "react-toastify";

export async function getInstantById(id: string) {
  const data = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/public/instant/" + id
  );
  if (data.ok) return data.json();
  else {
    toast.error("error during fetch");
  }
}

export async function getArticleById(id: string) {
  const data = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/public/article/" + id
  );
  if (data.ok) return data.json();
  else {
    toast.error("error during fetch");
  }
}

export async function getUserById(id: string) {
  if (id) {
    const data = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/public/user/" + id
    );
    if (data.ok) return data.json();
    else {
      toast.error("error during fetch");
    }
  }
}

export async function getCategories() {
  const data = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/public/categories"
  );
  if (data.ok) return data.json();
  else {
    toast.error("error during fetch");
  }
}

export async function searchQuery(body: {
  name: string;
  page: { page: number; size: number };
  searchType: SearchType;
}) {
  const data = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/public/search",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  if (data.ok) return data.json();
  else {
    toast.error("error during fetch");
  }
}

export enum SearchType {
  INSTANT = "INSTANT",
  ARTICLE = "ARTICLE",
  USER = "USER",
}

export type PublicArticle = {
  categories: string[];
  createdAt: string;
  id: string;
  ratingsNumber: number;
  image: string;
  content: string;
  views: number;
  ratingSum: number;
  userId: string;
  title: string;
  readTime: number;
};

export type User = {
  id: string;
  userName: string;
  name: string;
  profileImage: string;
  bio: string;
};
