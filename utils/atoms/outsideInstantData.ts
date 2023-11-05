import { atom } from "recoil";
type Instant = {
  id: string;
};

export const outsideInstantData = atom<Instant>({
  key: "outsideInstantData",
  default: {
    id: "",
  },
});
