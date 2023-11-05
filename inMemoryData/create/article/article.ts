import { Preferences } from "@capacitor/preferences";

export const setArticle = async (state: string) => {
  await Preferences.set({
    key: "article",
    value: state,
  });
};

export const getArticle = async () => {
  const { value } = await Preferences.get({ key: "article" });
  return value;
};

export const removeArticle = async () => {
  await Preferences.remove({ key: "article" });
};
