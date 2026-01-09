import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCustomer } from "../../api/auth.api";
import AuthForm from "../../components/forms/AuthForm/AuthForm";
import { SIGNUP_CONFIG } from "../../components/forms/AuthForm/auth.config"
import styles from "./SignUp.module.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleRegister = async (data) => {
    try {
      await registerCustomer({
        username: data.username,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
      });
      navigate("/login");
    } catch {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className={styles.container}>
      <AuthForm
        config={SIGNUP_CONFIG}
        onSubmit={handleRegister}
        error={error}
      />
    </div>
  );
};

export default SignUp;
