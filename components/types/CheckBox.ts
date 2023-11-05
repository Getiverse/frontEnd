export type CheckBox = {
    id: string;
    name: string;
    value: string;
    checked: boolean;
    onChange: () => void;
    className?: string;
}