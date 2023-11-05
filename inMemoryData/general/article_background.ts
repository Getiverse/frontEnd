import { Preferences } from "@capacitor/preferences";

export const setArticleBackground = async (state: string) => {
  await Preferences.set({
    key: "articleBackground",
    value: state,
  });
};

export const getArticleBackground = async () => {
  const { value } = await Preferences.get({ key: "articleBackground" });
  return value;
};

export const removeArticleBackground = async () => {
  await Preferences.remove({ key: "articleBackground" });
};
