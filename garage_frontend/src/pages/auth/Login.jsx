import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/forms/AuthForm/AuthForm";
import { LOGIN_CONFIG } from "../../components/forms/AuthForm/auth.config";
import styles from "./Login.module.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (data) => {
    try {
      const role = await login(data.username, data.password);
      toast.success("Welcome back!");
      navigate(role === "ADMIN" ? "/admin/dashboard" : "/customer/dashboard");
    } catch {
      setError("Login failed. Check credentials.");
    }
  };

  return (
    <div className={styles.container}>
      <AuthForm
        config={LOGIN_CONFIG}
        onSubmit={handleLogin}
        error={error}
      />
    </div>
  );
};

export default Login;
