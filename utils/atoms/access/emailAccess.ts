import { atom } from "recoil";

export const emailAccess = atom<string>({
  key: "emailAccess", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});
