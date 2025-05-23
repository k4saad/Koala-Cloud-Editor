import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { verifyJwtToken } from "./api.js";
import LoadingScreen from "../common/LoadingScreen.jsx"

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await verifyJwtToken();
        setIsAuth(result);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) {
    return (
      <LoadingScreen/>
    );
  }

  return isAuth ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;