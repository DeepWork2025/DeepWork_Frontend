const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchTasks = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks/`);
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return await response.json();
};
