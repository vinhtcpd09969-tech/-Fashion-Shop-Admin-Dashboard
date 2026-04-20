// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
// 🚀 1. Import AuthContext và AuthProvider
import { AuthContext, AuthProvider } from "./contexts/AuthContext";

import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Login from "./pages/Login";
import axios from "axios";



// 🚀 2. TỐI ƯU PROTECTED ROUTE BẰNG USECONTEXT
const ProtectedRoute = ({ children, allowedRoles }) => {
  // Lấy state trực tiếp từ Context thay vì đọc localStorage
  const { state } = useContext(AuthContext);
  const { isAuthenticated, user } = state;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra phân quyền
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/products" replace />;
  }

  return children;
};

// Component chứa Routes
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<ProtectedRoute allowedRoles={["Admin"]}><Dashboard /></ProtectedRoute>} />
          <Route path="customers" element={<ProtectedRoute allowedRoles={["Admin"]}><Customers /></ProtectedRoute>} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

// 🚀 3. BỌC TOÀN BỘ APP BẰNG AUTHPROVIDER
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;