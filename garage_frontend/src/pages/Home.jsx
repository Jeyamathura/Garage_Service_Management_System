import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Home = () => {
  const { isAuthenticated, role } = useAuth();

  // Redirect based on role if already logged in
  if (isAuthenticated) {
    if (role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
    if (role === "CUSTOMER") return <Navigate to="/customer/dashboard" replace />;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Garage Service Management</h1>
      <p style={styles.subtitle}>Manage your vehicles, bookings, and services efficiently</p>

      <div style={styles.buttonContainer}>
        <Link to="/login">
          <button style={{ ...styles.button, ...styles.loginButton }}>Login</button>
        </Link>
        <Link to="/signup">
          <button style={{ ...styles.button, ...styles.signupButton }}>Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "55vh",
    textAlign: "center",
    padding: "0 20px",
    background: "rgba(0, 128, 128, 0.05)", // subtle teal background
    borderRadius: "12px",
    margin: "50px auto",
    maxWidth: "500px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "teal",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#333",
    marginBottom: "30px",
    opacity: 0.85,
  },
  buttonContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    padding: "12px 25px",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  loginButton: {
    backgroundColor: "teal",
    color: "#fff",
  },
  signupButton: {
    backgroundColor: "#fff",
    color: "teal",
    border: "2px solid teal",
  },
};

export default Home;
