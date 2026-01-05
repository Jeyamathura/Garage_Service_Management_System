import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Home = () => {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated) {
    if (role === "ADMIN") return <Navigate to="/admin/dashboard" />;
    if (role === "CUSTOMER") return <Navigate to="/customer/dashboard" />;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Garage Service Management System</h1>
      <p>Manage services, vehicles, and bookings efficiently</p>

      <div style={{ marginTop: 20 }}>
        <Link to="/login">
          <button style={{ marginRight: 10 }}>Login</button>
        </Link>

        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
