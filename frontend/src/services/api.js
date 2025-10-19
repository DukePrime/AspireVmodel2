import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function getProjects() {
  const response = await api.get('/projects');
  return response.data;
}

export async function createProject(name, description) {
  const response = await api.post('/projects', { name, description });
  return response.data;
}

export async function getRequirements(projectId) {
  const response = await api.get(`/requirements?projectId=${projectId}`);
  return response.data;
}

export async function createRequirement(projectId, title, description, type, processStep) {
  const response = await api.post('/requirements', {
    projectId: Number(projectId),
    title,
    description,
    type,
    processStep,
  });
  return response.data;
}

export async function updateRequirement(id, data) {
  const response = await api.put(`/requirements/${id}`, data);
  return response.data;
}

export async function getDashboardMetrics(projectId) {
  const response = await api.get(`/dashboard/metrics?projectId=${projectId}`);
  return response.data;
}