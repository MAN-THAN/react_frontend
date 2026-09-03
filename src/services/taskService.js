import { axiosInstance } from "../axios/axiosInstance";

export const getTasksList = async ({
    page,
    limit,
    search,
    status,
    sort
  }) => {
    const res = await axiosInstance.get('/tasks', {params : {page, limit, search, status, sort}});
    return res.data;
}

export const getTaskById = async (taskId) => {
    const res = await axiosInstance.get(`/tasks/${taskId}`);
    return res.data;
}

export const updateTask = async (taskId, taskDetails) => {
    const res = await axiosInstance.put(`/tasks/${taskId}`, taskDetails);
    return res.data;
}

export const createTask = async (taskDetails) => {
    const res = await axiosInstance.post('/tasks/', taskDetails);
    return res.data;
}

export const updateTaskStatus = async (taskId) => {
    const res = await axiosInstance.patch(`/tasks/task_status/${taskId}`);
    return res.data;
}

export const deleteTask = async (taskId) => {
    const res = await axiosInstance.delete(`/tasks/${taskId}`);
    return res.data;
}