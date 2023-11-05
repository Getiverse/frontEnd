import { atom } from "recoil";

export const filterByCategoryState = atom<string | string[] | undefined>({
  key: "filterByCategory", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});
