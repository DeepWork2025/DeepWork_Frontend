// const API_BASE_URL = import.meta.env.VITE_API_URL;

//  Register a new user
export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await fetch(`http://127.0.0.1:8000/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  localStorage.setItem("authToken", data.token);
  return data;
};

// Login user and get token
export const loginUser = async (username: string, password: string) => {
  const response = await fetch(`http://localhost:8000/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  // Not sure what's response.ok
  // if (!response.ok) {
  //   console.error("Login failed:", data);
  //   throw new Error(data.error || "Login failed");
  // }

  localStorage.setItem("authToken", data.token);
  return data;
};

//  Logout user
export const logoutUser = () => {
  localStorage.removeItem("authToken");
};
