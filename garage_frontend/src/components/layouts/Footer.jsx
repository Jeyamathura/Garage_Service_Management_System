import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLinks}>
          <span className={styles.footerMock}>
            +94 77 123 4567 | No. 25, Main Street, Colombo | Email:
            example@garagesystem.lk
          </span>
        </div>
         <p className={styles.footerText}>
          &copy; {currentYear} Garage Service Management System. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
