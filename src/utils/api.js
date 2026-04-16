const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let authToken = localStorage.getItem('authToken');

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => authToken;

const fetchWithAuth = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// Auth API calls
export const authAPI = {
  register: (username, email, password, displayName) =>
    fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, displayName }),
    }),

  login: (username, password) =>
    fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getMe: () => fetchWithAuth('/auth/me'),

  logout: () => {
    setAuthToken(null);
  },
};

// Member API calls
export const memberAPI = {
  getMembers: () => fetchWithAuth('/members'),

  getMember: (id) => fetchWithAuth(`/members/${id}`),

  createMember: (name, displayName, spheres = []) =>
    fetchWithAuth('/members', {
      method: 'POST',
      body: JSON.stringify({ name, displayName, spheres }),
    }),

  updateMember: (id, updates) =>
    fetchWithAuth(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  deleteMember: (id) =>
    fetchWithAuth(`/members/${id}`, {
      method: 'DELETE',
    }),

  updateLog: (id, date, sphereId, completed) =>
    fetchWithAuth(`/members/${id}/log`, {
      method: 'PUT',
      body: JSON.stringify({ date, sphereId, completed }),
    }),

  addNote: (id, content, date, sphereId = null) =>
    fetchWithAuth(`/members/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content, date, sphereId }),
    }),

  deleteNote: (id, noteId) =>
    fetchWithAuth(`/members/${id}/notes/${noteId}`, {
      method: 'DELETE',
    }),
};
