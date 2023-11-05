import { Preferences } from "@capacitor/preferences";

export const setInstant = async (state: string) => {
  await Preferences.set({
    key: "instant",
    value: state,
  });
};

export const getInstant = async () => {
  const { value } = await Preferences.get({ key: "instant" });
  return value;
};

export const removeInstant = async () => {
  await Preferences.remove({ key: "instant" });
};
