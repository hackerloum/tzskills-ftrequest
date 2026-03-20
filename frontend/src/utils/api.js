import axios from 'axios';

const API_BASE = '/api/features';

export const getFeatures = (status = '') =>
  axios.get(API_BASE + (status ? `?status=${encodeURIComponent(status)}` : ''));

export const getFeature = (id) => axios.get(`${API_BASE}/${id}`);

export const createFeature = (data) => axios.post(API_BASE, data);

export const updateFeature = (id, data) => axios.put(`${API_BASE}/${id}`, data);

export const updateStatus = (id, status) =>
  axios.patch(`${API_BASE}/${id}/status`, { status });

export const deleteFeature = (id) => axios.delete(`${API_BASE}/${id}`);
