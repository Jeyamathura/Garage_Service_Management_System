import { Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const CustomerLayout = () => {
  const { role } = useAuth();

  if (role !== "CUSTOMER") return null;

  return (
    <main>
      <Outlet />
    </main>
  );
};

export default CustomerLayout;
