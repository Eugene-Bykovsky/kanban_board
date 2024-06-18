import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = {
  getTasks: async () => {
    const response = await axios.get(`${apiUrl}/tasks/`);
    return response.data;
  },
  createTask: async (taskData) => {
    const response = await axios.post(`${apiUrl}/tasks/`, taskData);
    return response.data;
  },
  updateTaskStatus: async (taskId, updatedTask) => {
    const response = await axios.put(`${apiUrl}/tasks/${taskId}/`, updatedTask);
    return response.data;
  },
};

export default api;
