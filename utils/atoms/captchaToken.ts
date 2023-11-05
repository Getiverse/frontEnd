import { atom } from "recoil";



export const captchaToken = atom({
    key: 'capthchaToken', // unique ID (with respect to other atoms/selectors)
    default: ""
    , // default value (aka initial value)
});