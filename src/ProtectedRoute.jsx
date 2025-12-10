// src/auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "./Auth.js";
import NotFound from "./NotFound.jsx";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  if (!isAuthenticated()) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <NotFound />;
  }

  return children;
};

export default ProtectedRoute;

