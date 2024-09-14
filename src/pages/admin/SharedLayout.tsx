import { Outlet } from "react-router-dom"

const SharedLayout = () => {
  return (
    <div>
      <div>SharedLayout</div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
export default SharedLayout