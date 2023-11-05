export type Button = {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
};

export type GenericButton = {
  onClick: () => void;
  type: "primary" | "secondary" | "thirdary";
  text: string;
  className?: string;
  Icon?: React.ReactNode;
  padding?: string;
  disabled?: boolean;
  textStyle?: string;
  color?: string;
  iconLeft?: boolean;
  buttonType?: "submit" | "reset" | "button" | undefined;
};
