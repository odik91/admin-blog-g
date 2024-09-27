import { CategoryData } from "@/features/category/categorySlice";

export type CategoryApiResponse = {
  data: Array<CategoryData>;
  meta: {
    totalRowCount: number;
  };
};

export type CategoryForSelect = {
  id: number | string;
  name: string;
};
