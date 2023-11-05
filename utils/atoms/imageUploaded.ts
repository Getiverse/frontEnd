import { atom } from "recoil";




export const imageUploaded = atom<string>({
    key: 'image', // unique ID (with respect to other atoms/selectors)
    default: undefined
    , // default value (aka initial value)
});