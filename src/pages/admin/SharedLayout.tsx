import { Footer } from "@/components";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

const SharedLayout = () => {
  return (
    <main className="flex">
      <div className="relative">
        <Sidebar />
      </div>
      <div className="h-screen w-full">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </main>
  );
};
export default SharedLayout;
