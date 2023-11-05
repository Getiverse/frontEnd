import { atom } from "recoil";

export const selectedCategory = atom<string[]>({
    key: 'categories', // unique ID (with respect to other atoms/selectors)
    default: []
    , // default value (aka initial value)
});