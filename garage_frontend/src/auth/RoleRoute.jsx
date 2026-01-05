import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RoleRoute = ({ role, children }) => {
  const { role: userRole, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RoleRoute;

