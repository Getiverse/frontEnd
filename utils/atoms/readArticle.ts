import { atom } from "recoil";

export const readArticle = atom({
  key: "readArticle",
  default: {
    title: "",
    image: "",
    content: "",
    categories: [],
    isInstant: false,
    id: "",
    userId: "",
    createdAt: "",
  },
});

