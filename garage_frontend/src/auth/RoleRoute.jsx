import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RoleRoute = ({ role, children }) => {
  const { role: userRole } = useAuth();
  return userRole === role ? children : <Navigate to="/login" />;
};

export default RoleRoute;
