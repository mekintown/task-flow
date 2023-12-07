// userService.js
import axios from "axios";
import { userLocalStorage } from "../constants";
import { User, UserFromGet } from "../types";

// Base URL for user-related requests
const userBaseUrl = "http://localhost:3003/api/users";

// Axios instance for making requests with the token
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  const loggedUserJSON = window.localStorage.getItem(userLocalStorage);
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON);
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Function to get all boards associated with the user
const getUserBoards = async () => {
  try {
    const response = await axiosInstance.get(`${userBaseUrl}/boards`);
    return response.data;
  } catch (error) {
    console.error("Error in getUserBoards:", error);
    throw error;
  }
};

const findUserByUsername = async (username: string): Promise<UserFromGet> => {
  try {
    const response = await axiosInstance.get(`${userBaseUrl}/find/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error in findUserByUsername:", error);
    throw error;
  }
};

// Exporting the userService
export const userService = {
  getUserBoards,
  findUserByUsername,
};
