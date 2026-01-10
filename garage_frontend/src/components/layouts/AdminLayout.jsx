import { Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const AdminLayout = () => {
  const { role } = useAuth();

  if (role !== "ADMIN") return null;

  return (
    <div className="main-layout">
      <div className="layout-content">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
