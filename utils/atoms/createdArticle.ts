import {
  getArticle,
  setArticle,
} from "./../../inMemoryData/create/article/article";
import { atom } from "recoil";
import { Descendant } from "slate";

export type Post = {
  title: string;
  image: string;
  content: any[];
  categories: string[];
};

const localStorageEffect =
  (key: any) =>
  ({
    setSelf,
    onSet,
  }: {
    setSelf: (val: any) => void;
    onSet: (val: any) => void;
  }) => {
    getArticle().then((savedValue) => {
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }
      onSet((newValue: string) => {
        setArticle(JSON.stringify(newValue));
      });
    });
  };

export const createdArticle = atom<Post>({
  key: "createdArticle",
  default: {
    title: "",
    image: "",
    content: [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ],
    categories: [],
  },
  effects_UNSTABLE: [localStorageEffect("article")],
});
