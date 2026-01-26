import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import styles from './Header.module.css';
import { useAuth } from '../../auth/AuthContext';
import {
  LogOut,
  LayoutDashboard,
  Wrench,
  Users,
  Car,
  Calendar,
  FileText,
  UserCircle,
  Menu,
  X
} from 'lucide-react';

const Header = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Services", path: "/admin/services", icon: Wrench },
    { name: "Customers", path: "/admin/customers", icon: Users },
    { name: "Vehicles", path: "/admin/vehicles", icon: Car },
    { name: "Bookings", path: "/admin/bookings", icon: Calendar },
    { name: "Invoices", path: "/admin/invoices", icon: FileText },
  ];

  const customerLinks = [
    { name: "Feed", path: "/customer/dashboard", icon: LayoutDashboard },
    { name: "Bookings", path: "/customer/bookings", icon: Calendar },
    { name: "Vehicles", path: "/customer/vehicles", icon: Car },
    { name: "Services", path: "/customer/services", icon: Wrench },
    { name: "Invoices", path: "/customer/invoices", icon: FileText },
    { name: "Profile", path: "/customer/profile", icon: UserCircle },
  ];

  const links = role === "ADMIN" ? adminLinks : customerLinks;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logoLink}>
            <div className={styles.logoIcon}>
              <img src="/logo.png" alt="AlignPro Logo" className={styles.logoImage} />
            </div>
            <span className={styles.logoText}>AlignPro <span className={styles.accentText}>Automotive</span></span>
          </Link>
        </div>

        {isAuthenticated && (
          <>
            <button
              className={styles.mobileToggle}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
              <div className={styles.linksGroup}>
                {links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`${styles.navLink} ${isActive(link.path) ? styles.navLinkActive : ''} `}
                    >
                      <Icon size={18} />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>

              <div className={styles.authGroup}>
                <button onClick={logout} className={styles.logoutBtn}>
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

