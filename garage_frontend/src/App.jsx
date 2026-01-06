import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { Navigate } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import RoleRoute from "./auth/RoleRoute";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";

import AdminDashboard from "./pages/admin/Dashboard";
import CustomerDashboard from "./pages/customer/Dashboard";

import MainLayout from "./components/layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <RoleRoute role="ADMIN">
                  <MainLayout>
                    <AdminDashboard />
                  </MainLayout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          {/* Customer Routes */}
          <Route
            path="/customer/dashboard"
            element={
              <PrivateRoute>
                <RoleRoute role="CUSTOMER">
                  <MainLayout>
                    <CustomerDashboard />
                  </MainLayout>
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
