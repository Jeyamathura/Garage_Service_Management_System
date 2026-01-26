import React from "react";
import styles from "./Footer.module.css";
import { Phone, MapPin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.copyright}>
          <span className={styles.brandName}>AlignPro Automotive</span>
          <span className={styles.divider}>|</span>
          &copy; {currentYear} All rights reserved.
        </div>
        <div className={styles.links}>
          <div className={styles.linkItem}>
            <Phone size={14} />
            <span className={styles.linkText}>+94 77 123 4567</span>
          </div>
          <div className={styles.linkItem}>
            <MapPin size={14} />
            <span className={styles.linkText}>No. 25, Main Street, Colombo</span>
          </div>
          <div className={styles.linkItem}>
            <Mail size={14} />
            <span className={styles.linkText}>support@garagemanagement.lk</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

