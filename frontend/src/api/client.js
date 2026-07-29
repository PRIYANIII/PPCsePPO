import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },
  signup: async (userData) => {
    const { data } = await api.post('/auth/signup', userData);
    return data;
  },
  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile').then(res => res.data),
  updateProfile: (updates) => api.put('/users/profile', updates).then(res => res.data),
  updatePlatformStats: (stats) => api.put('/users/platform-stats', stats).then(res => res.data),
  syncGFG: (profileUrl) => api.post('/users/platform-stats/gfg/sync', { profileUrl }).then(res => res.data),
  getDSAProgress: () => api.get('/users/dsa-progress').then(res => res.data),
  updateDSAProgress: (questionId, progress) => api.put(`/users/dsa-progress/${questionId}`, progress).then(res => res.data),
  updateCompanyReadiness: (data) => api.put('/users/company-readiness', data).then(res => res.data),
};

// DSA API
export const dsaAPI = {
  getTopics: () => api.get('/dsa/topics').then(res => res.data),
  getPublicTopics: () => api.get('/dsa/public/topics').then(res => res.data),
  getQuestionsByTopic: (topicId, filters) => api.get(`/dsa/topics/${topicId}/questions`, { params: filters }).then(res => res.data),
  getQuestion: (id) => api.get(`/dsa/questions/${id}`).then(res => res.data),
};

// Coding API
export const codingAPI = {
  submitCode: (questionId, data) => api.post(`/code/submit/${questionId}`, data).then(res => res.data),
  runCode: (questionId, data) => api.post(`/code/run/${questionId}`, data).then(res => res.data),
  getSubmissions: (questionId) => api.get(`/code/submissions/${questionId}`).then(res => res.data),
};

// Company API
export const companyAPI = {
  getAll: () => api.get('/companies').then(res => res.data),
  getOne: (id) => api.get(`/companies/${id}`).then(res => res.data),
  addExperience: (id, data) => api.post(`/companies/${id}/experiences`, data).then(res => res.data),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats').then(res => res.data),
  createTopic: (data) => api.post('/admin/topics', data).then(res => res.data),
  updateTopic: (id, data) => api.put(`/admin/topics/${id}`, data).then(res => res.data),
  deleteTopic: (id) => api.delete(`/admin/topics/${id}`).then(res => res.data),
  addSubTopic: (topicId, data) => api.post(`/admin/topics/${topicId}/subtopics`, data).then(res => res.data),
  createQuestion: (data) => api.post('/admin/questions', data).then(res => res.data),
  updateQuestion: (id, data) => api.put(`/admin/questions/${id}`, data).then(res => res.data),
  deleteQuestion: (id) => api.delete(`/admin/questions/${id}`).then(res => res.data),
  addTestCases: (id, testCases) => api.post(`/admin/questions/${id}/testcases`, { testCases }).then(res => res.data),
  createCompany: (data) => api.post('/admin/companies', data).then(res => res.data),
  updateCompany: (id, data) => api.put(`/admin/companies/${id}`, data).then(res => res.data),
};

export const aiAPI = {
  getResume: () => api.get('/ai/resume').then(res => res.data),
  analyzeResume: (resumeText) => api.post('/ai/resume/analyze', { resumeText }).then(res => res.data),
  uploadResume: (file) => { const data = new FormData(); data.append('resume', file); return api.post('/ai/resume/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => res.data); },
  generateReadiness: (companyId) => api.post(`/ai/readiness/${companyId}`).then(res => res.data),
  getCoach: () => api.post('/ai/coach').then(res => res.data),
  generateRoadmap: (weeks) => api.post('/ai/roadmap', { weeks }).then(res => res.data),
  getRoadmap: () => api.get('/ai/roadmap').then(res => res.data),
  updateRoadmapTask: (taskId, completed) => api.patch(`/ai/roadmap/tasks/${taskId}`, { completed }).then(res => res.data),
  analyzeApplication: (companyId, data) => api.post(`/ai/applications/${companyId}/analyze`, data).then(res => res.data),
  getApplications: () => api.get('/ai/applications').then(res => res.data),
  getSheet: () => api.get('/ai/sheet').then(res => res.data),
  generateSheet: (style) => api.post('/ai/sheet', { style }).then(res => res.data),
  updateSheetItem: (itemId, completed) => api.patch(`/ai/sheet/items/${itemId}`, { completed }).then(res => res.data),
  summarizeExperiences: (companyId) => api.post(`/ai/experiences/${companyId}/summary`).then(res => res.data),
};

export default api;
