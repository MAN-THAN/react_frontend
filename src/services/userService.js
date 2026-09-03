import { axiosInstance } from "../axios/axiosInstance";

export const getUserInfo = async () => {
    const res = await axiosInstance.get('/user/me');
    return res.data;
}