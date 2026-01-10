import styles from './Home.module.css';
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
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Garage Service Management</h1>
      <p className={styles.subtitle}>Manage your vehicles, bookings, and services efficiently</p>

      <div className={styles.buttonContainer}>
        <Link to="/login">
          <button className={`${styles.button} ${styles.loginButton}`}>Login</button>
        </Link>
        <Link to="/signup">
          <button className={`${styles.button} ${styles.signupButton}`}>Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
