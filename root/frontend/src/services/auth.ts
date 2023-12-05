import axios from "axios";

const baseUrl = "http://localhost:3003/api/auth";

let token: string | null = null;

const setToken = (newToken: string) => {
  token = `Bearer ${newToken}`;
};

const login = async (credentials: { username: string; password: string }) => {
  try {
    const response = await axios.post(`${baseUrl}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error occurred while logging in:", error);
    throw error;
  }
};

const logout = (
  setUser: (arg0: React.SetStateAction<object | null>) => void
) => {
  window.localStorage.removeItem("loggedBlogappUser");
  setUser(null);
};

const register = async (newUser: {
  username: string;
  password: string;
  name: string;
}) => {
  try {
    const response = await axios.post(`${baseUrl}/register`, newUser);
    return response.data;
  } catch (error) {
    console.error("Error occurred while registering:", error);
    throw error;
  }
};

const getMe = async () => {
  try {
    if (!token) {
      throw new Error("Token is missing");
    }

    const response = await axios.get(`${baseUrl}/me`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error occurred while fetching user data:", error);
    throw error;
  }
};

const authService = { login, logout, register, getMe, setToken };

export default authService;
