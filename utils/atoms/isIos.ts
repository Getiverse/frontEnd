import { atom } from "recoil";

export const isIos = atom<boolean>({
    key: 'checkIos', // unique ID (with respect to other atoms/selectors)
    default: undefined

    , // default value (aka initial value)
});