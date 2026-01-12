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
import AdminServices from "./pages/admin/Services";
import AdminCustomers from "./pages/admin/Customers";
import AdminBookings from "./pages/admin/Bookings";
import AdminInvoices from "./pages/admin/Invoices";

import CustomerDashboard from "./pages/customer/Dashboard";
import CustomerBookings from "./pages/customer/Bookings";
import CustomerVehicles from "./pages/customer/Vehicles";
import CustomerServices from "./pages/customer/Services";
import CustomerProfile from "./pages/customer/Profile";
import CustomerInvoices from "./pages/customer/Invoices";

import Headers from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="main-layout">
          <Headers />
          <div className="layout-content">
            <main style={{ padding: 0 }}>
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
                      <Route path="services" element={<AdminServices />} />
                      <Route path="customers" element={<AdminCustomers />} />
                      <Route path="bookings" element={<AdminBookings />} />
                      <Route path="invoices" element={<AdminInvoices />} />
                    </Route>
                  </Route>

                  {/* Customer Routes */}
                  <Route element={<RoleRoute role="CUSTOMER" />}>
                    <Route path="/customer" element={<CustomerLayout />}>
                      <Route path="dashboard" element={<CustomerDashboard />} />
                      <Route path="bookings" element={<CustomerBookings />} />
                      <Route path="vehicles" element={<CustomerVehicles />} />
                      <Route path="services" element={<CustomerServices />} />
                      <Route path="profile" element={<CustomerProfile />} />
                      <Route path="invoices" element={<CustomerInvoices />} />
                    </Route>
                  </Route>

                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
