export type PostType = {
  id?: string;
  category_id: string;
  subcategory_id: string;
  title: string;
  image: FileList;
  meta_description: string;
  meta_keyword: string;
  seo_title: string;
  content: string;
  is_active: "active" | "inactive";
};

export type PostCategory = {
  id: number;
  name: string;
};

export type PostSubategory = {
  id: number;
  subcategory: string;
};

export type PostMainData = {
  id: string;
  category_id: number;
  subcategory_id: string;
  title: string;
  slug: string;
  image: string;
  meta_description: string;
  meta_keyword: string;
  seo_title: string;
  content: string;
  is_active: number | boolean;
  get_category: PostCategory;
  get_subcategory: PostSubategory;
};

export type PostApiResponse = {
  data: PostMainData[];
  meta: {
    totalRowCount: number;
  };
};
