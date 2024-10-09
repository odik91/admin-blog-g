import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Error, Login } from "./pages";
import {
  Category,
  Comment,
  Dashboard,
  Menu,
  Message,
  Permission,
  Post,
  Role,
  SharedLayout,
  SinglePost,
  Subcategory,
  Submenu,
  User,
} from "./pages/admin";
import ProtectedRoute from "./pages/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="category" element={<Category />} />
          <Route path="subcategory" element={<Subcategory />} />
          <Route path="post" element={<Post />} />
          <Route path="post/:id" element={<SinglePost />} />
          <Route path="role" element={<Role />} />
          <Route path="user" element={<User />} />
          <Route path="message" element={<Message />} />
          <Route path="menu" element={<Menu />} />
          <Route path="submenu" element={<Submenu />} />
          <Route path="permission" element={<Permission />} />
          <Route path="comment" element={<Comment />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <ToastContainer position="top-center" />
    </BrowserRouter>
  );
};
export default App;
