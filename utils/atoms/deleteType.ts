import { atom } from "recoil";
export enum DeleteType {
  ARTICLE,
  INSTANT,
  LIBRARY,
  ARTICLE_FROM_LIBRARY,
  INSTANT_FROM_LIBRARY,
  REPLY,
  USER,
  RATING,
}

export const deleteType = atom<DeleteType | null>({
  key: "deleteType", // unique ID (with respect to other atoms/selectors)
  default: null,
});
