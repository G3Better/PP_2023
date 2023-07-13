import { Navigate, Outlet } from "react-router-dom";

const ProtectedRouters = () => {
  return !!localStorage.getItem("login") &&
    !!localStorage.getItem("password") ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};
export default ProtectedRouters;
