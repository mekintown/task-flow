import axios, { AxiosResponse } from "axios";
import { NewTask, Task } from "../types";

// Base URL for task-related requests
const baseUrl = "http://localhost:3003/api/tasks";

// Axios instance
const axiosInstance = axios.create();

// Set the token for authorization
axiosInstance.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  const token = `Bearer ${localStorage.getItem("loggedUserToken")}`; // Retrieve token from localStorage
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Service methods with error handling
const createTask = async (
  boardId: string,
  taskData: NewTask
): Promise<Task> => {
  try {
    const response = await axiosInstance.post(
      `${baseUrl}/${boardId}`,
      taskData
    );
    return response.data;
  } catch (error) {
    console.error("Error in createTask:", error);
    throw error;
  }
};

const getAllTasks = async (): Promise<Task> => {
  try {
    const response = await axiosInstance.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("Error in getAllTasks:", error);
    throw error;
  }
};

const getTasksByBoard = async (boardId: string): Promise<Task> => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/${boardId}`);
    return response.data;
  } catch (error) {
    console.error("Error in getTasksByBoard:", error);
    throw error;
  }
};

const deleteTask = async (boardId: string, taskId: string): Promise<Task> => {
  try {
    const response = await axiosInstance.delete(
      `${baseUrl}/${boardId}/${taskId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in deleteTask:", error);
    throw error;
  }
};

const updateTask = async (
  boardId: string,
  taskId: string,
  updatedData: NewTask
): Promise<Task> => {
  try {
    const response = await axiosInstance.put(
      `${baseUrl}/${boardId}/${taskId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error in updateTask:", error);
    throw error;
  }
};

// Exporting the task service
export const taskService = {
  createTask,
  getAllTasks,
  getTasksByBoard,
  deleteTask,
  updateTask,
};
