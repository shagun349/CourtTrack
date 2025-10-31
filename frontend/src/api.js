import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', res.data.token);
  return res.data;
};

export const register = async (email, password, name, role) => {
  const res = await api.post('/auth/register', { email, password, name, role });
  localStorage.setItem('token', res.data.token);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

// Cases
export const fetchCases = async (search) => {
  const res = await api.get('/cases', { params: { search } });
  return res.data;
};

export const fetchCaseById = async (id) => {
  const res = await api.get(`/cases/${id}`);
  return res.data;
};

export const createCase = async (title, description, client_email) => {
  const res = await api.post('/cases', { title, description, client_email });
  return res.data;
};

export const requestCase = async (title, description, lawyer_email) => {
  const res = await api.post('/cases/request', { title, description, lawyer_email });
  return res.data;
};

export const approveCase = async (id) => {
  const res = await api.put(`/cases/${id}/approve`);
  return res.data;
};

export const declineCase = async (id) => {
  const res = await api.delete(`/cases/${id}/decline`);
  return res.data;
};


// Judges
export const fetchJudges = async (search) => {
  const res = await api.get('/judges', { params: { search } });
  return res.data;
};

export const fetchJudgeById = async (id) => {
  const res = await api.get(`/judges/${id}`);
  return res.data;
};

// Notifications
export const fetchNotifications = async () => {
  const res = await api.get('/notifications');
  return res.data;
};

export const markNotificationsAsRead = async () => {
  const res = await api.put('/notifications/mark-read');
  return res.data;
};

export default api;
