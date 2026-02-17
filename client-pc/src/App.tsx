import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import HotelForm from "./pages/Merchant/HotelForm";
import AuditList from "./pages/Admin/AuditList";
import PublishList from "./pages/Admin/PublishList";

function App() {
  // 获取用户信息
  const getUserInfo = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    return token ? { token, role } : null;
  };

  const userInfo = getUserInfo();

  return (
    <BrowserRouter>
      <Routes>
        {/* 认证路由 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 商户路由 */}
        <Route
          path="/merchant/*"
          element={
            userInfo?.role === "merchant" ? (
              <HotelForm />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 管理员路由 */}
        <Route
          path="/admin/audit"
          element={
            userInfo?.role === "admin" ? (
              <AuditList />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/publish"
          element={
            userInfo?.role === "admin" ? (
              <PublishList />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 默认路由 */}
        <Route
          path="/"
          element={
            userInfo ? (
              userInfo.role === "merchant" ? (
                <Navigate to="/merchant" />
              ) : (
                <Navigate to="/admin/audit" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
