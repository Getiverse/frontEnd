
import { atom } from "recoil";



export const selectedFilter = atom<string>({
    key: 'selectedFilter', // unique ID (with respect to other atoms/selectors)
    default: ""
    , // default value (aka initial value)
});