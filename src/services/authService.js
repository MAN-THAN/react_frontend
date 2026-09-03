import { authAxiosInstance } from "../axios/authAxiosInstance";

export const login = async (userCredentials) => {
  const res = await authAxiosInstance.post("/auth/login", userCredentials);
  return res.data;
};

export const register = async (userDetails) => {
  const res = await authAxiosInstance.post("/auth/register", { first_name: userDetails.firstName, last_name: userDetails.lastName, email: userDetails.email, password: userDetails.password });
  return res.data;
};

export const logout = async () => {
  const res = await authAxiosInstance.post("/auth/logout");
  return res.data;
};

