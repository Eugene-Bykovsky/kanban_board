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
  updateTaskStatus: async (taskId, newStatus) => {
    const response = await axios.put(`${apiUrl}/tasks/${taskId}/`, {
      status: newStatus,
    });
    return response.data;
  },
};

export default api;
