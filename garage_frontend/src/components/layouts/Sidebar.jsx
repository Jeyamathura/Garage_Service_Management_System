import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import styles from "./Sidebar.module.css";

const Sidebar = ({ role }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Services", path: "/admin/services" },
    { name: "Customers", path: "/admin/customers" },
    { name: "Bookings", path: "/admin/bookings" },
    { name: "Invoices", path: "/admin/invoices" },
  ];

  const customerLinks = [
    { name: "Dashboard", path: "/customer/dashboard" },
    { name: "My Bookings", path: "/customer/bookings" },
    { name: "My Profile", path: "/customer/profile" },
    { name: "My Vehicles", path: "/customer/vehicles" },
    { name: "My Invoices", path: "/customer/invoices" },
  ];

  const links = role === "ADMIN" ? adminLinks : customerLinks;

  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul className={styles.sidebarList}>
          {links.map((link) => (
            <li key={link.path} className={styles.sidebarItem}>
              <Link
                to={link.path}
                className={`${styles.sidebarLink} ${
                  isActive(link.path) ? styles.sidebarLinkActive : ""
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <button className={styles.logoutButton} onClick={logout}>
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;