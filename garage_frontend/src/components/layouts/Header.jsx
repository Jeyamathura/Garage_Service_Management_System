import React from 'react';
import { Link, useLocation } from "react-router-dom";
import styles from './Header.module.css';
import { useAuth } from '../../auth/AuthContext';

const Header = () => {
  const { isAuthenticated, role, logout } = useAuth();
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
    { name: "Bookings", path: "/customer/bookings" },
    { name: "Vehicles", path: "/customer/vehicles" },
    { name: "Services", path: "/customer/services" },
    { name: "Invoices", path: "/customer/invoices" },
    { name: "Profile", path: "/customer/profile" },
  ];

  const links = role === "ADMIN" ? adminLinks : customerLinks;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 className={styles.title}>Garage Service Management System</h1>
          </Link>
        </div>

        {isAuthenticated ? (
          <nav className={styles.nav}>
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${styles.navLink} ${isActive(link.path) ? styles.navLinkActive : ''} `}
              >
                {link.name}
              </Link>
            ))}
            <button onClick={logout} className={styles.logoutBtn}>Logout</button>
          </nav>
        ) : (
          <div className={styles.subtitle}>Efficiently manage services & customers</div>
        )}
      </div>
    </header>
  );
};

export default Header;
