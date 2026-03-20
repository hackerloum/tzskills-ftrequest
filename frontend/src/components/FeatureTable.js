import React, { useState } from 'react';
import { STATUSES } from '../constants';

function priClass(p) {
  if (p === 'High') return 'cell-priority--high';
  if (p === 'Medium') return 'cell-priority--med';
  return 'cell-priority--low';
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function FeatureTable({ features, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th className="col-title">Title</th>
            <th className="col-priority">Priority</th>
            <th className="col-status">Status</th>
            <th className="col-date">Created</th>
            <th className="col-actions" />
          </tr>
        </thead>
        <tbody>
          {features.map((f) => (
            <Row key={f.id} f={f} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ f, onEdit, onDelete, onStatusChange }) {
  const [busy, setBusy] = useState(false);
  const [statusBusy, setStatusBusy] = useState(false);

  async function del() {
    if (!window.confirm(`Delete "${f.title}"?`)) return;
    setBusy(true);
    try {
      await onDelete(f.id);
    } catch {
      setBusy(false);
    }
  }

  async function onStatus(e) {
    setStatusBusy(true);
    try {
      await onStatusChange(f.id, e.target.value);
    } finally {
      setStatusBusy(false);
    }
  }

  return (
    <tr className={busy ? 'row-muted' : undefined}>
      <td className="col-title">
        <div className="cell-title">{f.title}</div>
        <div className="cell-desc">{f.description}</div>
      </td>
      <td className="col-priority">
        <span className={`cell-priority ${priClass(f.priority)}`}>{f.priority}</span>
      </td>
      <td className="col-status">
        <select className="table-select" value={f.status} onChange={onStatus} disabled={statusBusy}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>
      <td className="col-date">
        <time dateTime={f.created_at}>{formatDate(f.created_at)}</time>
      </td>
      <td className="col-actions">
        <div className="table-actions">
          <button type="button" className="btn-icon btn-icon--ghost" onClick={() => onEdit(f)} title="Edit">
            <svg className="btn-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button type="button" className="btn-icon btn-icon--ghost btn-icon--danger" onClick={del} disabled={busy} title="Delete">
            <svg className="btn-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
