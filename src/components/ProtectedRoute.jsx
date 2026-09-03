import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export const ProtectedRoute = ({ children }) => {
  const { token, isInitializing } = useContext(AuthContext);

  if (isInitializing) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

