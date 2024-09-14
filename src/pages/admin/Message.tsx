import BreadCrumb from "../../components/BreadCrumb";
const Message = () => {
  return (
    <div
      className="p-3 bg-gray-100 overflow-scroll border-red-600"
      style={{ height: "calc(100vh - 150px)", minHeight: "calc(100vh - 150px)" }}
    >
      <BreadCrumb link="/" target="home" current="message" />
      <main className="m-2 p-3 bg-white rounded-md shadow-md"></main>
    </div>
  )
}
export default Message