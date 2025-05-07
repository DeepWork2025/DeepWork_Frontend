import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Register a new user
export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register/`, userData);
    const data = response.data;

    localStorage.setItem("authToken", data.token);
    return data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {  
    const message = error.response?.data?.error || "Registration failed";
    throw new Error(message);
  }
};

// Login user and get token
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login/`, {
      username,
      password,
    });
    const data = response.data;

    localStorage.setItem("authToken", data.token);
    return data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message = error.response?.data?.error || "Login failed";
    throw new Error(message);
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem("authToken");
};
