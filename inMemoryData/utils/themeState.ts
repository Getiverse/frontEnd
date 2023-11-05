import { Preferences } from "@capacitor/preferences";

export const setTheme = async (state: string) => {
  await Preferences.set({
    key: "theme",
    value: state,
  });
};

export const getTheme = async () => {
  const { value } = await Preferences.get({ key: "theme" });
  return value;
};
