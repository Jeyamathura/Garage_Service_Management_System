import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCustomer } from "../../api/auth.api";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerCustomer({
        username,
        password,
        first_name: firstName,
        last_name: lastName,
        email,
      });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Sign up to manage your bookings and vehicles</p>

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
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.registerButton}>Register</button>
        </form>

        <p style={styles.loginText}>
          Already have an account? <a href="/login" style={styles.loginLink}>Login</a>
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
    padding: "20px",
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
  registerButton: {
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
  loginText: {
    marginTop: "20px",
    fontSize: "0.9rem",
    color: "#555",
  },
  loginLink: {
    color: "teal",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default SignUp;