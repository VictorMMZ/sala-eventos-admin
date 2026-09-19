import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const user = sessionStorage.getItem("user");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}