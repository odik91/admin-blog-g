export type PostType = {
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
