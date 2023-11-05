import { atom } from "recoil";

export const customLinks = atom<
  {
    url: string;
    name: string;
  }[]
>({
  key: "customLinks", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
