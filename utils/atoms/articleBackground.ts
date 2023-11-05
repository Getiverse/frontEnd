import { setArticleBackground } from "./../../inMemoryData/general/article_background";
import { atom } from "recoil";
import { getArticleBackground } from "../../inMemoryData/general/article_background";

// define this function somewhere
const localStorageEffect =
  (key: any) =>
  ({
    setSelf,
    onSet,
  }: {
    setSelf: (val: any) => void;
    onSet: (val: any) => void;
  }) => {
    getArticleBackground().then((savedValue) => {
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }
      onSet((newValue: string) => {
        setArticleBackground(JSON.stringify(newValue));
      });
    });
  };

export const articleBackground = atom<string>({
  key: "articleBackground", // unique ID (with respect to other atoms/selectors)
  default: undefined, // default value (aka initial value)
  effects_UNSTABLE: [localStorageEffect("articleBackground")],
});
