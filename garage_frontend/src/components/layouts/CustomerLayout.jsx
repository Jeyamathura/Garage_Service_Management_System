import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const CustomerLayout = () => {
  const { role } = useAuth();

  if (role !== "CUSTOMER") return null;

  return (
    <div className="main-layout">
      <Header />
      <div className="layout-content">
        <Sidebar role="CUSTOMER" />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
