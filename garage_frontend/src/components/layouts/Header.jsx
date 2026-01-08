const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <h1 style={styles.title}>Garage Service Management System</h1>
        <p style={styles.subtitle}>Efficiently manage services, vehicles, and customers</p>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "rgba(0, 128, 128, 0.95)", // teal with slight opacity
    color: "#fff",
    padding: "25px 0",
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    backdropFilter: "blur(5px)", // subtle glass effect
  },
  container: {
    width: "90%",
    maxWidth: "1200px",
    margin: "0 auto",
    textAlign: "center",
  },
  title: {
    margin: "0",
    fontSize: "2.2rem",
    fontWeight: "bold",
    letterSpacing: "1px",
  },
  subtitle: {
    margin: "8px 0 20px",
    fontSize: "1.05rem",
    fontStyle: "italic",
    opacity: 0.85, // subtle transparency
  },
  link: {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 500,
    padding: "8px 15px",
    borderRadius: "6px",
    transition: "background 0.3s, transform 0.2s",
  },
  linkHover: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transform: "scale(1.05)",
  },
};

export default Header;
