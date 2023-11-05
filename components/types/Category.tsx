import { Dispatch, SetStateAction } from "react";

export type Category = {
  category: string;
  Icon: string;
  className?: string;
  id: string;
  selectedCategories?: string[] | string | undefined;
  setSelectedCategories?: Dispatch<SetStateAction<string[] | string | undefined>>;
  filter?: boolean;
};
