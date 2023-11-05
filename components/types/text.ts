export type Text = {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  color?: string;
  size?: string;
  weight?: string;
  immutable?: boolean;
  id?: string;
  editor?: boolean;
  disableDark?: boolean;
};
