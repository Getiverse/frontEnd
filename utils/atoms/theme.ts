import { getTheme, setTheme } from "./../../inMemoryData/utils/themeState";
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
    getTheme().then((savedValue) => {
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }
      onSet((newValue: string) => {
        setTheme(JSON.stringify(newValue));
      });
    });
  };

export const theme = atom({
  key: "theme", // unique ID (with respect to other atoms/selectors)
  default: "System", // default value (aka initial value)
  effects_UNSTABLE: [localStorageEffect("theme")],
});
