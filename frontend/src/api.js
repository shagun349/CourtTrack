import axios from 'axios';

let token = null;

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  token = res.data.token;
  return res.data;
};

export const register = async (email, password, name, role) => {
  const res = await api.post('/auth/register', { email, password, name, role });
  token = res.data.token;
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

export const logout = () => {
  token = null;
};

// Cases
export const fetchCases = async (search) => {
  const res = await api.get('/cases', { params: { search } });
  return res.data;
};

export const fetchCaseCount = async () => {
  const res = await api.get('/cases/count');
  return res.data.count;
};

export const fetchCaseById = async (id) => {
  const res = await api.get(`/cases/${id}`);
  return res.data;
};

export const createCase = async (title, description, client_email, hearing_date) => {
  const res = await api.post('/cases', { title, description, client_email, hearing_date });
  return res.data;
};

export const requestCase = async (title, description, lawyer_email, hearing_date) => {
  const res = await api.post('/cases/request', { title, description, lawyer_email, hearing_date });
  return res.data;
};

export const approveCase = async (id) => {
  const res = await api.put(`/cases/${id}/approve`);
  return res.data;
};

export const declineCase = async (id) => {
  const res = await api.put(`/cases/${id}/decline`);
  return res.data;
};

export const flagCase = async (id, status) => {
  const res = await api.put(`/cases/${id}/flag`, { status });
  return res.data;
};


// Lawyers
export const fetchLawyers = async () => {
  const res = await api.get('/lawyers');
  return res.data;
};

// Notifications
export const fetchNotifications = async () => {
  const res = await api.get('/notifications');
  return res.data;
};

export const fetchUnreadNotificationCount = async () => {
  const res = await api.get('/notifications/unread-count');
  return res.data.unreadCount;
}
export const markNotificationsAsRead = async () => {
  const res = await api.put('/notifications/mark-read');
  return res.data;
};

export default api;
