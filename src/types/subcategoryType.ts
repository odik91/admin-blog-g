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
