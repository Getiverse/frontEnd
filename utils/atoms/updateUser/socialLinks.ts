import { atom } from "recoil";

export const socialLinks = atom<string[]>({
  key: "socialLinks", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
