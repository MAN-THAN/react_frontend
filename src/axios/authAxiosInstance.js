import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_APP_URL

export const authAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});