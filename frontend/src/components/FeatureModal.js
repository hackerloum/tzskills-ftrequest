import React, { useState, useEffect } from 'react';
import { PRIORITIES, STATUSES } from '../constants';

export default function FeatureModal({ feature, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Open',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!feature) return;
    setForm({
      title: feature.title,
      description: feature.description,
      priority: feature.priority,
      status: feature.status,
    });
  }, [feature]);

  async function submit() {
    const e = {};
    if (!form.title.trim()) e.title = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Request failed';
      setErrors({ api: msg });
    } finally {
      setSaving(false);
    }
  }

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(ev) => ev.stopPropagation()}>
        <div className="modal-header">
          <h2>{feature ? 'Edit' : 'New'}</h2>
          <button type="button" className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {errors.api && <div className="form-error-banner">{errors.api}</div>}

        <div className="form-group">
          <label>Title</label>
          <input
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
            className={errors.title ? 'input-error' : ''}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            className={errors.description ? 'input-error' : ''}
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Priority</label>
            <select value={form.priority} onChange={(e) => setField('priority', e.target.value)}>
              {PRIORITIES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={(e) => setField('status', e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={submit} disabled={saving}>
            {saving ? '…' : feature ? 'Save' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
