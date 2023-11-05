import {
  getFontStyle,
  setFontStyle,
} from "./../../inMemoryData/general/fontStyle";
import { atom } from "recoil";

const localStorageEffect =
  (key: any) =>
  ({
    setSelf,
    onSet,
  }: {
    setSelf: (val: any) => void;
    onSet: (val: any) => void;
  }) => {
    getFontStyle().then((savedValue) => {
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }
      onSet((newValue: string) => {
        setFontStyle(JSON.stringify(newValue));
      });
    });
  };

export const fontStyle = atom({
  key: "fontStyle",
  default: {
    fontFamily: "roboto",
    fontSizeMoltiplier: 0,
  },
  effects_UNSTABLE: [localStorageEffect("fontFamily")],
});
