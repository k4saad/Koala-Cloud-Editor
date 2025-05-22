import { Navigate } from "react-router-dom";
import { verifyJwtToken } from "./api";
import { getToken } from "./auth";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    const token = getToken();
    if (!token) 
        return false;
    return verifyJwtToken();
  };

  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;