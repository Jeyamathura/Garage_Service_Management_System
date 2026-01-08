import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

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
    <aside style={styles.sidebar}>
      <nav>
        <ul style={styles.ul}>
          {links.map((link) => (
            <li key={link.path} style={styles.li}>
              <Link
                to={link.path}
                style={{
                  ...styles.link,
                  ...(isActive(link.path) ? styles.activeLink : {}),
                }}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <button style={styles.logoutButton} onClick={logout}>
          Logout
        </button>
      </nav>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    backgroundColor: "rgba(0, 128, 128, 0.9)", // teal with opacity
    color: "#ffffff",
    padding: "20px",
    boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
    backdropFilter: "blur(5px)", // subtle glass effect
  },
  ul: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  li: {
    marginBottom: "15px",
  },
  link: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: 500,
    display: "block",
    padding: "10px 15px",
    borderRadius: "8px",
    transition: "background 0.3s, transform 0.2s",
  },
  activeLink: {
    backgroundColor: "rgba(255, 255, 255, 0.2)", // subtle white overlay for active
    transform: "scale(1.02)",
  },
  logoutButton: {
    marginTop: "30px",
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "teal",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s, color 0.3s",
  },
};

export default Sidebar;
