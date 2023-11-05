import { atom } from "recoil";
/**
 * triggers the Modal for upload files(images from unplash, pexels, local...)
 */
export const imageModal = atom<boolean>({
  key: "imageModal", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});
