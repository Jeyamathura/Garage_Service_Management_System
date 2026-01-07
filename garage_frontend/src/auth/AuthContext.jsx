import { createContext, useContext, useState, useEffect} from "react";
import { loginRequest } from "../api/auth.api";
import {jwtDecode} from "jwt-decode";
import {
  setTokens,
  clearTokens,
  getAccessToken,
} from "../utils/token";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //Restore Session on Refresh
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ username: decoded.username });
        setRole(decoded.role);
        setIsAuthenticated(true);
      } catch (err) {
        clearTokens();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Call backend login
      const data = await loginRequest({ username, password });

      // Save tokens
      setTokens(data.access, data.refresh);

      // Decode JWT to inspect payload
      const payload = JSON.parse(atob(data.access.split(".")[1]));
      console.log("JWT payload:", payload); // <-- See everything backend sends

      const role = payload.role;
      console.log("Detected role:", role); // <-- Should be "ADMIN" or "CUSTOMER"

      // Update context state
      setUser({ username });
      setRole(role);
      setIsAuthenticated(true);

      return role; // Login.jsx uses this to redirect
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  if (isLoading) return null;

  return (
    <AuthContext.Provider
      value={{ user, role, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
