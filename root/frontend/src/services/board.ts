import axios from "axios";
import { Board, NewBoard } from "../types";

// Base URL for board-related requests
const baseUrl = "http://localhost:3003/api/boards";

// Token management
let token: string | null = null;

const setToken = (newToken: string): void => {
  token = `Bearer ${newToken}`;
};

// Axios instance for making requests with the token
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Service methods with error handling
const createBoard = async (boardData: NewBoard): Promise<Board> => {
  try {
    const response = await axiosInstance.post(baseUrl, boardData);
    return response.data;
  } catch (error) {
    // Handle or throw the error as per your application's error handling strategy
    console.error("Error in createBoard:", error);
    throw error;
  }
};

const getAllBoards = async (): Promise<Board> => {
  try {
    const response = await axiosInstance.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("Error in getAllBoards:", error);
    throw error;
  }
};

const getBoardById = async (boardId: string): Promise<Board> => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/${boardId}`);
    return response.data;
  } catch (error) {
    console.error("Error in getBoardById:", error);
    throw error;
  }
};

const deleteBoard = async (boardId: string): Promise<Board> => {
  try {
    const response = await axiosInstance.delete(`${baseUrl}/${boardId}`);
    return response.data;
  } catch (error) {
    console.error("Error in deleteBoard:", error);
    throw error;
  }
};

const updateBoard = async (
  boardId: string,
  updatedData: NewBoard
): Promise<Board> => {
  try {
    const response = await axiosInstance.put(
      `${baseUrl}/${boardId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error in updateBoard:", error);
    throw error;
  }
};

// Exporting the service and setToken function
export const boardService = {
  setToken,
  createBoard,
  getAllBoards,
  getBoardById,
  deleteBoard,
  updateBoard,
};
