import { Button } from "@/components/ui/button";
import BreadCrumb from "../../components/BreadCrumb";
import { Separator } from "@/components/ui/separator";
const Category = () => {
  return (
    <div
      className="p-3 bg-gray-100 overflow-y-scroll overflow-x-hidden border-red-600"
      style={{
        height: "calc(100vh - 150px)",
        minHeight: "calc(100vh - 150px)",
      }}
    >
      <BreadCrumb link="/" target="home" current="category" />
      <main className="m-2 p-3 bg-white rounded-md shadow-md">
        <div className="flex items-center justify-between">
          <h1>Total Record</h1>
          <Button variant="outline">Add new category</Button>
        </div>
        <Separator className="my-3" />
        <div className="h-[2000px]">
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Totam
            impedit velit culpa alias quod nihil deleniti possimus odio
            voluptatem magnam, sint corporis sunt debitis, a dolore! Ex earum
            nobis velit!
          </p>
        </div>
      </main>
    </div>
  );
};
export default Category;
