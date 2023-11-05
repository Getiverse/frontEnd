import { Preferences } from "@capacitor/preferences";

export const setHiddenPosts = async (state: string) => {
  await Preferences.set({
    key: "hiddenPosts",
    value: state,
  });
};

export const getHiddenPosts = async () => {
  const { value } = await Preferences.get({ key: "hiddenPosts" });
  return value;
};
