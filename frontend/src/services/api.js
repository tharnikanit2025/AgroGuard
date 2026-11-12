/**
 * AgroGuard AI - Frontend API Client
 * Seamlessly interfaces with FastAPI REST backend endpoints.
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

function getAuthHeaders() {
  const token = localStorage.getItem('agroguard_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {})
    }
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  login: (email, password) => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  register: (data) => request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  demoLogin: () => request('/api/auth/demo-login', {
    method: 'POST'
  }),
  getMe: () => request('/api/auth/me'),

  // Dashboard
  getDashboard: () => request('/api/dashboard'),

  // Fields
  getFields: () => request('/api/fields'),
  createField: (data) => request('/api/fields', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getFieldDetails: (id) => request(`/api/fields/${id}`),
  getFieldHistory: (id) => request(`/api/fields/${id}/history`),
  getFieldRisk: (id) => request(`/api/fields/${id}/risk`),

  // Observations & Disease Detection
  analyzeCrop: (data) => request('/api/observations/analyze', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  compareObservations: (data) => request('/api/observations/compare', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Environmental Risk
  analyzeEnvironmentalRisk: (data) => request('/api/environment/analyze', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Interventions
  recordIntervention: (data) => request('/api/interventions', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getFieldInterventions: (fieldId) => request(`/api/interventions/field/${fieldId}`),

  // Alerts
  getAlerts: () => request('/api/alerts'),
  markAlertRead: (alertId) => request(`/api/alerts/${alertId}/read`, {
    method: 'PATCH'
  }),

  // Helper URL builder for image assets
  imageUrl: (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_BASE}${path}`;
  }
};
