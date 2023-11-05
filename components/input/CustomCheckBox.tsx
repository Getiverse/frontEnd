import { CheckBox } from "../types/CheckBox";

function CustomCheckBox({ id, name, value, checked, onChange, className }: CheckBox) {
    return (
        <input type="checkbox" id={id} name={name} value={value} className={`w-4 h-4 ${className}`} checked={checked} onChange={onChange} />
    )
}


export default CustomCheckBox;