import axios from 'axios';

const API = axios.create({
  baseURL: 'https://task-tracker-7jwc.onrender.com'
});

// Attach JWT to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === Task Endpoints ===
export const getTasks = (params = {}) => API.get('/tasks', { params });
export const getStats = () => API.get('/tasks/stats');
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// === Auth Endpoints ===
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
