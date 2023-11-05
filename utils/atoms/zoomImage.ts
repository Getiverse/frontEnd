import { atom } from "recoil";

export const zoomImageState = atom<string | null | undefined>({
  key: "zoomImage",
  default: null,
});
