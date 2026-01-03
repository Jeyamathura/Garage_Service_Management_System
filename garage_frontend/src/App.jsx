import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";
import RoleRoute from "./auth/RoleRoute";

import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import CustomerDashboard from "./pages/customer/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <RoleRoute role="ADMIN">
                  <AdminDashboard />
                </RoleRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/customer/dashboard"
            element={
              <PrivateRoute>
                <RoleRoute role="CUSTOMER">
                  <CustomerDashboard />
                </RoleRoute>
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
