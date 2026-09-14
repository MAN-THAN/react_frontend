import { useAuth } from "../hooks/useAuth"

export const isAuthenticated = () => {
    const {token} = useAuth();
    return token ? true : false;
 }

 export const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
 }