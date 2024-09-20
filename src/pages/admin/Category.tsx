import { Separator } from "@/components/ui/separator";

import { AddCategoryModal, CategoryTableV2 } from "@/components/category";
import BreadCrumb from "../../components/BreadCrumb";

const Category = () => {
  return (
    <div
      className="p-3 bg-gray-100 overflow-y-scroll overflow-x-hidden"
      style={{
        height: "calc(100vh - 150px)",
        minHeight: "calc(100vh - 150px)",
      }}
    >
      <BreadCrumb link="/" target="home" current="category" />
      <main className="m-2 p-4 bg-white rounded-md shadow-md">
        <div className="flex items-center justify-end">
          <AddCategoryModal />
        </div>
        <Separator className="my-3" />
        <CategoryTableV2 />
      </main>
    </div>
  );
};

export default Category;
