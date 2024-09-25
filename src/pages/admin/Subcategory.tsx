import SubcategoryTable from "@/components/subcategory/SubcategoryTable";
import BreadCrumb from "../../components/BreadCrumb";

const Subcategory = () => {
  return (
    <div
      className="p-3 bg-gray-100 overflow-y-scroll overflow-x-hidden border-red-600"
      style={{
        height: "calc(100vh - 150px)",
        minHeight: "calc(100vh - 150px)",
      }}
    >
      <BreadCrumb link="/" target="home" current="subcategory" />
      <main className="m-2 p-3 bg-white rounded-md shadow-md">
        <SubcategoryTable />
      </main>
    </div>
  );
};
export default Subcategory;
