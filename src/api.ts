const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchData = async (endpoint: string, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API Request Failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
