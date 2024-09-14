import Sidebar from "@/components/Sidebar"
import { Outlet } from "react-router-dom"

const SharedLayout = () => {
  return (
    <main className="flex">
      <div>
        <Sidebar />
      </div>
      <div>
        <Outlet />
      </div>
    </main>
  )
}
export default SharedLayout