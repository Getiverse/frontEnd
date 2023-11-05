import { atom } from "recoil";

export const contactEmail = atom<string>({
  key: "contactEmail", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});
