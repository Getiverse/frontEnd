import { Preferences } from "@capacitor/preferences";

export const setFontStyle = async (state: string) => {
  await Preferences.set({
    key: "fontStyle",
    value: state,
  });
};

export const getFontStyle = async () => {
  const { value } = await Preferences.get({ key: "fontStyle" });
  return value;
};

export const removeFontStyle = async () => {
  await Preferences.remove({ key: "fontStyle" });
};
