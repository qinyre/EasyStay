import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import AuditList from "./pages/Admin/AuditList";
import PublishList from "./pages/Admin/PublishList";
import HotelForm from "./pages/Merchant/HotelForm";
import HotelList from "./pages/Merchant/HotelList";
import "./index.css";

// 路由保护组件
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: string;
}> = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 商户路由 */}
        <Route
          path="/merchant/hotels"
          element={
            <ProtectedRoute requiredRole="merchant">
              <HotelList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/merchant/add"
          element={
            <ProtectedRoute requiredRole="merchant">
              <HotelForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/merchant/edit/:id"
          element={
            <ProtectedRoute requiredRole="merchant">
              <HotelForm />
            </ProtectedRoute>
          }
        />

        {/* 管理员路由 */}
        <Route
          path="/admin/audit"
          element={
            <ProtectedRoute requiredRole="admin">
              <AuditList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/publish"
          element={
            <ProtectedRoute requiredRole="admin">
              <PublishList />
            </ProtectedRoute>
          }
        />

        {/* 默认路由 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
