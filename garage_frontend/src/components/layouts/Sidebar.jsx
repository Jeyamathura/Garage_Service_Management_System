import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { role } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside>
      <nav>
        <ul>
          {role === "ADMIN" && (
            <>
              <li>
                <Link to="/admin/dashboard">Admin Dashboard</Link>
              </li>
              <li>
                <Link to="/admin/services">Manage Services</Link>
              </li>
              <li>
                <Link to="/admin/customers">Manage Customers</Link>
              </li>
            </>
          )}

          {role === "CUSTOMER" && (
            <>
              <li>
                <Link to="/customer/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/customer/bookings">My Bookings</Link>
              </li>
            </>
          )}

          {role === null && (
            //Hide sidebar entirely when role === null
            <></>
          )}
        </ul>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </aside>
  );
};

export default Sidebar;
