import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>
          &copy; {currentYear} Garage Service Management System. All rights reserved.
        </p>
        <div style={styles.links}>
          <a href="#about" style={styles.link}>About</a>
          <a href="#contact" style={styles.link}>Contact</a>
          <a href="#privacy" style={styles.link}>Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "rgba(0, 128, 128, 0.95)",
    color: "#fff",
    padding: "20px 0",
    marginTop: "50px",
    boxShadow: "0 -4px 6px rgba(0,0,0,0.1)",
    backdropFilter: "blur(5px)",
  },
  container: {
    width: "90%",
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "10px",
  },
  text: {
    margin: 0,
    fontSize: "0.9rem",
    opacity: 0.85,
  },
  links: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
  },
  link: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "0.9rem",
    transition: "opacity 0.3s",
  },
};

export default Footer;
