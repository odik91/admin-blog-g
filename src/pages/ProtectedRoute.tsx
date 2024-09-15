import { useAppSelector } from "@/hooks/userCustomHook";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((store) => store.user);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};
export default ProtectedRoute;
