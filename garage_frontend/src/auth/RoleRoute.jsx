import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RoleRoute = ({ role }) => {
  const { role: userRole, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
