import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const role = await login(username, password);
      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "CUSTOMER") navigate("/customer/dashboard");
      else setError("Unknown role");
    } catch (err) {
      console.error(err);
      setError("Login failed. Check username and password.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Log in to manage your services, bookings, and vehicles</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.loginButton}>Login</button>
        </form>

        <p style={styles.signupText}>
          Don't have an account? <a href="/signup" style={styles.signupLink}>Sign Up</a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "35px 30px",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
    width: "100%",
    maxWidth: "450px",
    textAlign: "center",
  },
  title: {
    color: "teal",
    fontSize: "1.9rem",
    fontWeight: "700",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#333",
    marginBottom: "25px",
    opacity: 0.85,
  },
  error: {
    color: "#DC2626",
    marginBottom: "15px",
    fontWeight: "500",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px 15px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "border 0.3s, box-shadow 0.3s",
  },
  loginButton: {
    padding: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "teal",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  signupText: {
    marginTop: "20px",
    fontSize: "0.9rem",
    color: "#555",
  },
  signupLink: {
    color: "teal",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Login;
