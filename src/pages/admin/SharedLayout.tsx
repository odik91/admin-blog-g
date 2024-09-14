import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

const SharedLayout = () => {
  return (
    <main className="flex">
      <div>
        <Sidebar />
      </div>
      <div className="w-full">
        <Navbar />
        <Outlet />
      </div>
    </main>
  );
};
export default SharedLayout;
