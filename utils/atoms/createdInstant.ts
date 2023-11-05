import {
  getInstant,
  setInstant,
} from "./../../inMemoryData/create/instant/instant";
import { atom } from "recoil";

type Instant = {
  title: string;
  userId: string;
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
    getInstant().then((savedValue) => {
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }
      onSet((newValue: string) => {
        setInstant(JSON.stringify(newValue));
      });
    });
  };

export const createdInstant = atom<Instant>({
  key: "createdInstant",
  default: {
    userId: "",
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
  effects_UNSTABLE: [localStorageEffect("instant")],
});
