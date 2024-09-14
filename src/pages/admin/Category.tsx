import BreadCrumb from "../../components/BreadCrumb";
const Category = () => {
  return (
    <div
      className="p-3 bg-gray-100 overflow-scroll border-red-600"
      style={{ height: "calc(100vh - 150px)", minHeight: "calc(100vh - 150px)" }}
    >
      <BreadCrumb link="/" target="home" current="category" />
      <main className="m-2 p-3 bg-white rounded-md shadow-md">
        <h1>test</h1>
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
