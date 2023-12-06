import axios from "axios";
import { NewTask, Task, TasksWithPagination } from "../types";
import { userLocalStorage } from "../constants";

// Base URL for task-related requests
const baseUrl = "http://localhost:3003/api/tasks";

// Axios instance
const axiosInstance = axios.create();

// Set the token for authorization
axiosInstance.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  const loggedUserJSON = window.localStorage.getItem(userLocalStorage);
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON);
    config.headers.Authorization = `Bearer ${user.token}`;
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

const getAllTasks = async (): Promise<Task[]> => {
  try {
    const response = await axiosInstance.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("Error in getAllTasks:", error);
    throw error;
  }
};

const getTasksByBoard = async (
  boardId: string,
  page = 1,
  limit = 10
): Promise<TasksWithPagination> => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/${boardId}`, {
      params: { page, limit },
    });
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
