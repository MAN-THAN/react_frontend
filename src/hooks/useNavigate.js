import { useNavigate } from "react-router-dom";

export const useNavigator = () => {
    const navigate = useNavigate()
    return navigate;
};
