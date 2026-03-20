import React, { useState } from 'react';
import './App.css';
import { useFeatures } from './hooks/useFeatures';
import { useTheme } from './hooks/useTheme';
import { FILTER_STATUS, FILTER_LABELS } from './constants';
import FeatureTable from './components/FeatureTable';
import FeatureModal from './components/FeatureModal';
import ThemeToggle from './components/ThemeToggle';
import { FooterSidebar, FooterMobile } from './components/Footer';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    features,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    createFeature,
    updateFeature,
    updateStatus,
    deleteFeature,
  } = useFeatures();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const stats = {
    total: features.length,
    open: features.filter((f) => f.status === 'Open').length,
    inProgress: features.filter((f) => f.status === 'In Progress').length,
    done: features.filter((f) => f.status === 'Completed').length,
  };

  return (
    <div className="app">
      <aside className="shell-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo" />
          <span className="sidebar-app-name">Requests</span>
        </div>
        <nav className="sidebar-nav">
          <button type="button" className="sidebar-link sidebar-link--active">
            List
          </button>
        </nav>
        <FooterSidebar />
      </aside>

      <div className="shell-main">
        <header className="shell-topbar">
          <div className="topbar-left">
            <h1 className="topbar-title">Features</h1>
            <p className="topbar-meta">Track requests and status</p>
          </div>
          <div className="topbar-actions">
            <ThemeToggle dark={theme === 'dark'} onToggle={toggleTheme} />
            <button type="button" className="btn-primary" onClick={() => { setEditing(null); setModalOpen(true); }}>
              New
            </button>
          </div>
        </header>

        <main className="shell-content">
          <section className="workspace">
            <div className="workspace-toolbar">
              <h2 className="workspace-title">Queue</h2>
              <p className="workspace-desc">Filter by status. Click a row to edit.</p>
            </div>

            <div className="kpi-row">
              <div className="kpi">
                <span className="kpi-value">{stats.total}</span>
                <span className="kpi-label">Total</span>
              </div>
              <div className="kpi kpi--accent">
                <span className="kpi-value">{stats.open}</span>
                <span className="kpi-label">Open</span>
              </div>
              <div className="kpi kpi--warn">
                <span className="kpi-value">{stats.inProgress}</span>
                <span className="kpi-label">In progress</span>
              </div>
              <div className="kpi kpi--ok">
                <span className="kpi-value">{stats.done}</span>
                <span className="kpi-label">Done</span>
              </div>
            </div>

            <div className="filter-bar">
              <span className="filter-bar-label">Status</span>
              <div className="filter-pills">
                {FILTER_STATUS.map((s) => (
                  <button
                    type="button"
                    key={s || 'all'}
                    className={`filter-pill ${statusFilter === s ? 'filter-pill--on' : ''}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {FILTER_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            {loading && (
              <div className="state-container">
                <div className="spinner" />
                <p className="state-text">Loading…</p>
              </div>
            )}

            {error && !loading && (
              <div className="state-container state-container--error">
                <p className="state-title">Couldn&apos;t load data</p>
                <p className="state-text">{error}</p>
                <p className="state-hint">
                  On Render: set <code className="inline-code">DB_*</code> env vars and open{' '}
                  <code className="inline-code">/api/health/db</code> to see the DB error.
                </p>
              </div>
            )}

            {!loading && !error && features.length === 0 && (
              <div className="state-container state-container--empty">
                <p className="state-title">Nothing here</p>
                <p className="state-hint">No rows for this filter yet.</p>
                <button type="button" className="btn-primary" onClick={() => { setEditing(null); setModalOpen(true); }}>
                  Add one
                </button>
              </div>
            )}

            {!loading && !error && features.length > 0 && (
              <FeatureTable
                features={features}
                onEdit={(f) => { setEditing(f); setModalOpen(true); }}
                onDelete={deleteFeature}
                onStatusChange={updateStatus}
              />
            )}
          </section>
        </main>
        <FooterMobile />
      </div>

      {modalOpen && (
        <FeatureModal
          feature={editing}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSubmit={(data) => (editing ? updateFeature(editing.id, data) : createFeature(data))}
        />
      )}
    </div>
  );
}
