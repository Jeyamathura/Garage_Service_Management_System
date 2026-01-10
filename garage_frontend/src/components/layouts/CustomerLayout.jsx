import { Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const CustomerLayout = () => {
  const { role } = useAuth();

  if (role !== "CUSTOMER") return null;

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

export default CustomerLayout;
