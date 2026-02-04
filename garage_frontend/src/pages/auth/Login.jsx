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
    } catch (err) {
      // Debug: log the error structure
      console.log("Login error:", err);
      console.log("Error response data:", err?.response?.data);

      // Check if it's a suspension error - DRF ValidationError can be nested
      const errorData = err?.response?.data;
      const errorDetail = errorData?.detail;
      const errorCode = errorData?.code;
      const nestedDetail = errorData?.detail?.detail; // Nested validation error
      const nestedCode = errorData?.detail?.code;

      const isSuspended =
        errorCode === 'user_suspended' ||
        nestedCode === 'user_suspended' ||
        (typeof errorDetail === 'string' && errorDetail.includes('suspended')) ||
        (typeof nestedDetail === 'string' && nestedDetail.includes('suspended')) ||
        (typeof errorDetail === 'object' && JSON.stringify(errorDetail).includes('suspended'));

      if (isSuspended) {
        toast(`Your account has been suspended. Please contact support.`, {
          icon: '🚫',
          style: {
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
            fontWeight: '600'
          },
          duration: 5000
        });
        setError("Account suspended");
      } else {
        setError("Login failed. Check credentials.");
      }
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
