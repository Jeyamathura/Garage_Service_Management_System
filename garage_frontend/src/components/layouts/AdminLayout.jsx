import { Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const AdminLayout = () => {
  const { role } = useAuth();

  if (role !== "ADMIN") return null;

  return (
    <main>
      <Outlet />
    </main>
  );
};

export default AdminLayout;
