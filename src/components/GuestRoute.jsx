import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";


export const GuestRoute = ({ children }) => {
    const { token } = useAuth();
  
    if (token) {
      return <Navigate to="/my-tasks" replace />;
    }
  
    return children;
  };