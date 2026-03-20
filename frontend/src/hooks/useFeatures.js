import { useState, useEffect, useCallback } from 'react';
import * as api from '../utils/api';

function loadError(err) {
  const d = err.response?.data;
  if (d?.message) return d.message;
  if (Array.isArray(d?.errors) && d.errors[0]?.msg) return d.errors[0].msg;
  return 'Failed to load';
}

export function useFeatures() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getFeatures(statusFilter);
      setFeatures(res.data.data);
    } catch (err) {
      setError(loadError(err));
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function createFeature(data) {
    const res = await api.createFeature(data);
    setFeatures((prev) => [res.data.data, ...prev]);
    return res.data.data;
  }

  async function updateFeature(id, data) {
    const res = await api.updateFeature(id, data);
    setFeatures((prev) => prev.map((f) => (f.id === id ? res.data.data : f)));
    return res.data.data;
  }

  async function updateStatus(id, status) {
    const res = await api.updateStatus(id, status);
    setFeatures((prev) => prev.map((f) => (f.id === id ? res.data.data : f)));
  }

  async function deleteFeature(id) {
    await api.deleteFeature(id);
    setFeatures((prev) => prev.filter((f) => f.id !== id));
  }

  return {
    features,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    createFeature,
    updateFeature,
    updateStatus,
    deleteFeature,
    refetch: load,
  };
}
