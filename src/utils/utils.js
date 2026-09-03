import { useAuth } from "../hooks/useAuth"

export const isAuthenticated = () => {
    const {token} = useAuth();
    return token ? true : false;
 }