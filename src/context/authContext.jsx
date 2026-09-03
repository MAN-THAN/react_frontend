import { createContext, useState, useEffect } from "react";
import { clearAccessToken, setAccessToken, subscribeToTokenChange, getAccessToken } from "../utils/tokenStore";
import { axiosInstance } from "../axios/axiosInstance";


export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  useEffect(() => {
    const unsubscribe = subscribeToTokenChange((newToken) => {
      setToken(newToken);
    });

    return unsubscribe;
  }, []);
  useEffect(() => {
    const restoreSession = async () => {
      if (getAccessToken()) {
        setIsInitializing(false);
        return;
      }
      try {
        const response = await axiosInstance.post("/auth/refresh");
        const newAccessToken = response.data.access_token;
        setAccessToken(newAccessToken);
      } catch (error) {
        clearAccessToken();
      } finally {
        setIsInitializing(false);
      }
    };
    restoreSession();
  }, []);

  const login = (token) => {
    setAccessToken(token);
  };
  const logout = () => {
    clearAccessToken();
  };

  return <AuthContext.Provider value={{ token, login, logout, isInitializing }}>{children}</AuthContext.Provider>;
};
