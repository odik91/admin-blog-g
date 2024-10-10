import { UseFormReturn } from "react-hook-form";

export type Subcategory = {
  id?: string;
  category_id: number;
  subcategory: string;
  slug?: string;
  description: string;
  is_active: boolean | number;
  category_name?: string;
};

export type SubcategoryApiResponse = {
  data: Array<Subcategory>;
  meta: {
    totalRowCount: number;
  };
};

export type OptionType = { value: string; label: string };

export type FormType = UseFormReturn<
  {
    title: string;
    content: string;
    meta_description: string;
    meta_keyword: string;
    seo_title: string;
    category_id: string;
    subcategory_id: string;
    is_active: "active" | "inactive";
    id?: string | undefined;
    image: FileList;
  },
  unknown,
  undefined
>;