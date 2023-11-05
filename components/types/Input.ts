export type Input = {
  placeHolder?: string;
  className?: string;
  Icon?: JSX.Element;
  width?: string;
  type?: string | "text";
  transparent?: boolean;
  onChange: (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  label?: string;
  value: string;
  border?: string;
  color?: string;
  rounded?: boolean;
  textColor?: string;
  height?: string;
  disableDark?: boolean;
  maxLength?: number;
  padding?: string;
  onIconClick?: () => void;
};
