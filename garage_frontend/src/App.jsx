import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";

import PrivateRoute from "./auth/PrivateRoute";
import RoleRoute from "./auth/RoleRoute";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Home from "./pages/Home";

import AdminLayout from "./components/layouts/AdminLayout";
import CustomerLayout from "./components/layouts/CustomerLayout";

import AdminDashboard from "./pages/admin/Dashboard";
import CustomerDashboard from "./pages/customer/Dashboard";

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
          <Route element={<PrivateRoute />}>
            
            {/* Admin Routes */}
            <Route element={<RoleRoute role="ADMIN" />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="services" element={<div>Services Management Page</div>} />
                <Route path="customers" element={<div>Customers Management Page</div>} />
                <Route path="bookings" element={<div>Bookings Management Page</div>} />
                <Route path="invoices" element={<div>Invoices Management Page</div>} />
              </Route>
            </Route>

            {/* Customer Routes */}
            <Route element={<RoleRoute role="CUSTOMER" />}>
              <Route path="/customer" element={<CustomerLayout />}>
                <Route path="dashboard" element={<CustomerDashboard />} />
                <Route path="bookings" element={<div>My Bookings Page</div>} />
                <Route path="profile" element={<div>My Profile Page</div>} />
                <Route path="vehicles" element={<div>My Vehicles Page</div>} />
                <Route path="services" element={<div>Services Views</div>} />
              </Route>
            </Route>

          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
